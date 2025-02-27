const Router = require('express');
const router = new Router();
const workSessionController = require('../controllers/workSessionController');
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/CheckRoleMiddleware')
// 🔹 Начать сессию
router.post('/start',authMiddleware, workSessionController.startSession);

// 🔹 Завершить сессию
router.post('/end', authMiddleware, workSessionController.endSession);

// 🔹 Получить сессии (можно фильтровать по сотруднику и дате)
router.get('/', authMiddleware, workSessionController.getSessions);

// 🔹 Удалить сессию
router.delete('/:id', authMiddleware, workSessionController.deleteSession);

module.exports = router;
