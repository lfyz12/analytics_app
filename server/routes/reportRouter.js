const Router = require('express');
const router = new Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.post('/', authMiddleware, reportController.createReport);
router.get('/', authMiddleware, reportController.getAllReports);
router.get('/employee/:employee_id', authMiddleware, reportController.getReportsByEmployee);
router.get('/:employee_id/:report_date',authMiddleware, reportController.getReportByDate);
router.delete('/:id', authMiddleware, reportController.deleteReport);

module.exports = router;
