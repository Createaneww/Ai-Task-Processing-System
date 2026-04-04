import expres from 'express';
import Task from '../models/Task.js';
import { pushTask } from '../services/queueService.js';

// POST /api/tasks
 const createTask = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { type, input } = req.body;

    if (!type || !input) {
      return res.status(400).json({ success: false, error: "type and input are required" });
    }

    const task = await Task.create({
      userId: req.user._id,
      type,
      input,
      status: "pending",
    });

    try {
      await pushTask({
        taskId: task._id.toString(),
        type,
        input,
      });
    } catch (err) {
      console.error("Queue push failed:", err.message);
    }

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks
const listTasks = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [tasks, total] = await Promise.all([
            Task.find({ userId: req.user._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Task.countDocuments({ userId: req.user._id }),
        ]);

        res.json({
            success: true,
            data: tasks,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/tasks/:id
const getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Ownership check
        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        res.json({ success: true, data: task });
    } catch (err) {
        next(err);
    }
};

export  { createTask, listTasks, getTask };
