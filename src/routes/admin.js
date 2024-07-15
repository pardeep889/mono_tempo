
const router = require('express').Router();
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const adminController = require("../modules/admin/controller/admin")


router.get('/dashboard-count',authenticateJWT, authorizeRoles('ADMIN'), adminController.countFetch);
router.get('/fetch-users',authenticateJWT, authorizeRoles('ADMIN'), adminController.FetchUsers);

router.post('/promote-explore',authenticateJWT, authorizeRoles('ADMIN'), adminController.promoteAExplore);


module.exports = router;
