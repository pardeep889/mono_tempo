
const router = require('express').Router();
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const adminController = require("../modules/admin/controller/admin")


router.get('/dashboard-count',authenticateJWT, authorizeRoles('ADMIN'), adminController.countFetch);

module.exports = router;
