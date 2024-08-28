const express = require('express');
const router = express.Router();
const { getAllTasksCtrl, createNewTaskCtrl, updateTaskCtrl, deleteTaskCtrl, getTaskCtrl } = require('../controllers/tasks.controller');
const { TASKS_PATHS } = require('../constants/routes.constants');

router.get(TASKS_PATHS.all, getAllTasksCtrl);
router.get(TASKS_PATHS.one, getTaskCtrl);
router.post(TASKS_PATHS.create, createNewTaskCtrl);
router.put(TASKS_PATHS.update, updateTaskCtrl);
router.delete(TASKS_PATHS.delete, deleteTaskCtrl);

module.exports = router