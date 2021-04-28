const express = require('express')

const router = express.Router()
const todosRoutes = require('./todosRoutes.js')
const errorHandler = require('../middlewares/errorHandler.js')
const Controller = require('../controllers/controller.js')


router.post('/register', Controller.register)
router.post('/login', Controller.login)
router.post('/loginGoogle', Controller.loginGoogle)

//hanya utk cek user
router.get('/users', Controller.showUsers)

router.use('/todos',todosRoutes)

router.use(errorHandler)


module.exports = router