const router = require('express').Router();
const { authenticateJWT } = require('../middleware/auth');
const exploreController = require('../modules/explore/controllers/explore');

// ************** public routes *****************  //
router.get('/fetch-single-explores/:id',authenticateJWT, exploreController.getExploreById);



// ************** Protected routes *****************  //
router.get('/fetch-explores',authenticateJWT, exploreController.getExplore);
router.post('/fetch-user-explores',authenticateJWT, exploreController.getMyExplore);

router.post('/:id/like', authenticateJWT, exploreController.likeExplore);
router.post('/:id/unlike', authenticateJWT, exploreController.unlikeExplore);

// ************** private routes *****************  //
router.post('/update-status/:id',authenticateJWT, exploreController.updateExploreStatus);

router.post('/auth/add',authenticateJWT, exploreController.exploreData);
router.delete('/auth/delete/:exploreId', authenticateJWT, exploreController.deleteExplore);
router.post('/auth/update/:id',exploreController.updateExplore);


router.post('/auth/add-new-tag/:id',authenticateJWT, exploreController.addTags);
router.post('/auth/update-tag/:id',authenticateJWT, exploreController.updateTag);
router.delete('/auth/remove-tag/:id',authenticateJWT, exploreController.removeTag);

// Update Routes 
router.put('/trailerVideo/:id', authenticateJWT, exploreController.updateTrailerVideo);
router.put('/unit/:id', authenticateJWT, exploreController.updateUnitDetails);
router.put('/video/:id', authenticateJWT, exploreController.updateVideoDetails);
router.put('/update/:id', authenticateJWT, exploreController.updateExploreDetails);


module.exports= router;
