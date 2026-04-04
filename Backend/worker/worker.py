"""
AI Task Processor – Python Worker (Production Ready)
---------------------------------------------------
- Listens to Redis queue (BRPOP)
- Updates MongoDB task status
- Handles retries
- Logs everything properly
"""

import json
import os
import time
import logging

import redis
from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient

# ── Config ─────────────────────────────────────────
load_dotenv()

MONGO_URI   = os.getenv("MONGO_URI", "mongodb://localhost:27017/ai_task_processor")
REDIS_HOST  = os.getenv("REDIS_HOST", "127.0.0.1")
REDIS_PORT  = int(os.getenv("REDIS_PORT", 6379))
QUEUE_NAME  = "taskQueue"
MAX_RETRIES = 3

# ── Logging ────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("worker")

# ── Connections ────────────────────────────────────
mongo_client = MongoClient(MONGO_URI)
db           = mongo_client["ai_task_processor"]
tasks_col    = db["tasks"]

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True,
    socket_keepalive=True
)
logger.info(f"Worker started. Listening on '{QUEUE_NAME}'...")

# ── Task processors ────────────────────────────────
def process_task(task_type: str, input_text: str) -> str:
    if task_type == "uppercase":
        return input_text.upper()
    elif task_type == "reverse":
        return input_text[::-1]
    elif task_type == "wordcount":
        return str(len(input_text.split()))
    else:
        raise ValueError(f"Unknown task type: {task_type}")

# ── DB helper ─────────────────
def update_task(task_id: str, **fields):
    tasks_col.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": fields}
    )

# ── Retry handler ────────────
def retry_task(task, retries):
    if retries < MAX_RETRIES:
        task["retries"] = retries + 1
        redis_client.lpush(QUEUE_NAME, json.dumps(task))
        logger.warning(f"Retrying task [{task.get('taskId')}] ({retries+1}/{MAX_RETRIES})")
    else:
        logger.error(f"Max retries reached for task [{task.get('taskId')}]")

# ── Main loop ──────────────────────────────────────
def run():
    while True:
        task_id = None

        try:
            raw = redis_client.brpop(QUEUE_NAME, timeout=0)
            if not raw:
                continue

            _, payload = raw
            task = json.loads(payload)

            task_id    = task.get("taskId")
            task_type  = task.get("type")
            task_input = task.get("input", "")
            retries    = task.get("retries", 0)

            logger.info(f"Processing task [{task_id}] type={task_type}")

            # Mark running
            update_task(task_id, status="running")

            start_time = time.time()

            # Process task
            result = process_task(task_type, task_input)

            end_time = time.time()

            # Mark success
            update_task(
                task_id,
                status="success",
                result=result,
                processingTime=round(end_time - start_time, 3)
            )

            logger.info(f"Task [{task_id}] completed → {result}")

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON payload: {e}")

        except Exception as e:
            logger.error(f"Error processing task [{task_id}]: {e}")

            try:
                if task_id:
                    update_task(task_id, status="failed", logs=str(e))

                # Retry logic
                if 'task' in locals():
                    retry_task(task, retries)

            except Exception as mongo_err:
                logger.error(f"Mongo update failed: {mongo_err}")

            time.sleep(1)

# ── Entry point ────────────────────────────────────
if __name__ == "__main__":
    run()