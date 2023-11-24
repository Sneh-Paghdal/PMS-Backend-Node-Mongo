const router = require('express').Router();
const UserController = require('../controller/user.controller');
router.post('/api/reguser',UserController.register);
router.post('/api/login',UserController.login);
router.post('/api/admin/login',UserController.adminLogin);
router.post('/api/admin/reguser',UserController.adminRegister);
module.exports = router;