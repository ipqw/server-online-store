const Router = require('express')
const router = new Router()

const deviceRouter = require('./deviceRouter')
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const brandRouter = require('./brandRouter')
const ratingRouter = require('./ratingRouter')
const basketRouter = require('./basketRouter')
const basketDeviceRouter = require('./basketDeviceRouter')

router.use('/user', userRouter)
router.use('/brand', brandRouter)
router.use('/type', typeRouter)
router.use('/device', deviceRouter)
router.use('/rating', ratingRouter)
router.use('/basket', basketRouter)
router.use('/basketdevice', basketDeviceRouter)

module.exports = router