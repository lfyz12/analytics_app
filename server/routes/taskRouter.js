const Router = require('express');
const router = new Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/AuthMiddleware')

// 🔹 Создать задачу
router.post('/', authMiddleware, taskController.createTask);

// 🔹 Получить список всех задач (фильтрация по статусу и исполнителю)
router.get('/', authMiddleware, taskController.getTasks);

// 🔹 Получить одну задачу
router.get('/:id', authMiddleware, taskController.getTaskById);

// 🔹 Обновить задачу
router.put('/:id', authMiddleware, taskController.updateTask);

// 🔹 Удалить задачу
router.delete('/:id',authMiddleware, taskController.deleteTask);

module.exports = router;
