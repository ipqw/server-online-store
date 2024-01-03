const Router = require('express')
const ratingController = require('../controllers/ratingController')
const router = new Router()

router.post('/', ratingController.create)
router.post('/update', ratingController.update)
router.get('/:deviceId', ratingController.getOne)
router.get('/', ratingController.getAll)
router.delete('/', ratingController.delete)

module.exports = router