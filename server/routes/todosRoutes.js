const express = require('express')

const router = express.Router()
const {authenticate, authorize} = require('../middlewares/auth.js')
const Controller = require('../controllers/controller.js')

router.use(authenticate)
router.get( '/', Controller.getAllTodos)
router.post( '/', Controller.postTodos)

router.use('/:id', authorize)
router.get('/:id', Controller.getIdTodos)
router.put('/:id', Controller.putIdTodos)
router.patch('/:id', Controller.patchIdTodos)
router.delete('/:id', Controller.deleteIdTodos)

module.exports = router