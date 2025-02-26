const Router = require('express');
const router = new Router();
const taskTimeLogController = require('../controllers/taskTimeLogController');
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.post('/', authMiddleware, taskTimeLogController.startTaskTimeLog);
router.put('/:id', authMiddleware, taskTimeLogController.endTaskTimeLog);
router.get('/', authMiddleware, taskTimeLogController.getAllTaskTimeLogs);
router.get('/employee/:employee_id', authMiddleware, taskTimeLogController.getTaskTimeLogsByEmployee);
router.get('/task/:task_id', authMiddleware, taskTimeLogController.getTaskTimeLogsByTask);
router.delete('/:id', authMiddleware, taskTimeLogController.deleteTaskTimeLog);

module.exports = router;
