const router = require('express').Router();
const categoryController = require('../modules/category/controllers/category');


//********************Public Routes ***************************/
router.get('/fetch', categoryController.fetchAllCategory);
router.get('/fetch-by-id/:categoryId', categoryController.fetchCategoryById);

//********************Private Routes ***************************/
router.post('/create',categoryController.createCategory)
router.delete('/delete/:categoryId', categoryController.deleteCategory);
router.put('/update/:categoryId', categoryController.updateCategory);

module.exports= router;
