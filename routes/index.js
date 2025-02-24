const express = require('express')
const router = express.Router();
const registerController = require('../controllers/RegisterController');
const loginController = require('../controllers/LoginController');
const userController = require('../controllers/UserController');
const { validateRegister, validateLogin } = require('../utils/validators/auth');
const { validateUser, validateUserUpdate } = require('../utils/validators/user');
const verifyToken = require('../middlewares/auth');

router.post('/register', validateRegister, registerController.register);
router.post('/login', validateLogin, loginController.login);
router.get('/admin/users', verifyToken, userController.findUsers);
router.post('/admin/users', verifyToken, validateUser, userController.createUser);
router.get('/admin/users/:id', verifyToken, userController.findUserById);
router.put('/admin/users/:id', verifyToken, validateUserUpdate, userController.updateUser);
router.delete('/admin/users/:id', verifyToken, userController.deleteUser);

module.exports = router