const Router = require('express')
const router = new Router()
const employeeController = require('../controllers/employeeController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.post('/createUser', authMiddleware, checkRole(['ADMIN']), employeeController.createUser)
router.post('/registration', employeeController.registration)
router.post('/login', employeeController.login)
router.post('/logout', authMiddleware, employeeController.logout)

router.get('/refresh', employeeController.refresh)
router.post('/getAll', checkRole(['ADMIN']), employeeController.getAllEmployees)
router.post('/getUserByUserID', authMiddleware, employeeController.getUserByEmployeeID)
//
// router.put('/changeDefaultAddressByNumber', authMiddleware, employeeController.changeDefaultAddressByNumber)
// router.put('/changeNumberByNumber', authMiddleware, employeeController.changeNumberByNumber)
// router.put('/changeNameByNumber', authMiddleware, employeeController.changeNameByNumber)
// router.put('/changeDefaultAddressByID', authMiddleware, employeeController.changeDefaultAddressById)
// router.put('/changeNumberByID', authMiddleware, employeeController.changeNameById)
// router.put('/changeNameByID', authMiddleware, employeeController.changeNameById)
// router.put('/changeNumberAndNameByID', authMiddleware, employeeController.changeNumberAndNameById)
// router.put('/changeAllByID', authMiddleware, employeeController.changeAllById)
// router.put('/changeRoleByNumber', checkRole(['ADMIN']), employeeController.changeRoleByNumber)
// router.put('/changePasswordbyNumber', employeeController.changePasswordbyNumber)


module.exports = router