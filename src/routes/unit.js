const router = require('express').Router();
const unitController = require('../modules/units/controllers/units');

//*******************private routes******************/
router.post('/create', unitController.createUnit);
router.post('/update/:id',unitController.updateUnit);
router.delete('/delete/:id',unitController.deleteUnit);
router.post('/create-video',unitController.createVideo);
router.post('/update-video/:id',unitController.updateVideo);
router.delete('/delete-video/:id',unitController.deleteVideo);
router.post('/like-video/:id',unitController.likeVideo);

module.exports= router;
