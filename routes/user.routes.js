const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.controller')
// const multer = require('multer')
// const upload = multer()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/user/:id', userController.getOneUser)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get(' /users', userController.getUsers)

module.exports = router
