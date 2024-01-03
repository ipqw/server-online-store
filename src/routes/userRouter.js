const Router = require('express')
const router = new Router()
const UserController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.get('/auth', authMiddleware, UserController.check)
router.get('/', checkRole('ADMIN'), UserController.getAll)
router.get('/:id', checkRole('ADMIN'), UserController.getOne)
router.delete('/', checkRole('ADMIN'), UserController.delete)

module.exports = router