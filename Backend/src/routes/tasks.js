import express from 'express';
import { createTask, listTasks, getTask } from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
// All task routes are protected
router.use(protect);

// POST /api/tasks        – create a task
router.post('/', createTask);

// GET  /api/tasks        – list user's tasks (paginated)
router.get('/', listTasks);

// GET  /api/tasks/:id    – get single task (owner only)
router.get('/:id', getTask);

export default router;
