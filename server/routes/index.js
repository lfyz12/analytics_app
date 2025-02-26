const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const workSessionRouter = require('./workSessionRouter')
const taskRouter = require('./taskRouter')
const taskTimeLogRouter = require('./taskTimeLogRouter')
const reportRouter = require('./reportRouter')

router.use('/employee', userRouter)
router.use('/workSession', workSessionRouter)
router.use('/task', taskRouter)
router.use('/taskTimeLog', taskTimeLogRouter)
router.use('/report', reportRouter)

module.exports = router