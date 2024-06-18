const router = require('express').Router();
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const categoryController = require('../modules/category/controllers/category');


//********************Public Routes ***************************/
router.get('/fetch',authenticateJWT, categoryController.fetchAllCategory);
router.get('/fetch-by-id/:categoryId', categoryController.fetchCategoryById);

//********************Private Routes ***************************/
router.post('/create', authenticateJWT, authorizeRoles('ADMIN'), categoryController.createCategory)
router.delete('/delete/:categoryId',authenticateJWT, authorizeRoles('ADMIN'), categoryController.deleteCategory);
router.put('/update/:categoryId', categoryController.updateCategory);

module.exports= router;
