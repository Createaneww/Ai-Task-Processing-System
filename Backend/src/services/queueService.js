import redis from "../config/redis.js";

const QUEUE_NAME = 'taskQueue';

/**
 * Push a task onto the Redis queue (left push).
 * Workers consume from the right (BRPOP).
 * @param {Object} task - Plain object to serialize and enqueue
 */
const pushTask = async (task) => {
    await redis.lpush(QUEUE_NAME, JSON.stringify(task));
};

/**
 * Blocking pop from the queue.
 * Useful for a Node-based worker or testing.
 * @param {number} timeout - Seconds to block (0 = indefinitely)
 */
const popTask = async (timeout = 0) => {
    const result = await redis.brpop(QUEUE_NAME, timeout);
    if (!result) return null;
    return JSON.parse(result[1]);
};

export  { pushTask, popTask };
