const router = require('express').Router();
const { authenticateJWT } = require('../middleware/auth');
const exploreController = require('../modules/explore/controllers/explore');

// ************** public routes *****************  //
router.get('/get-explore-by-id/:id',exploreController.getExploreById);



// ************** Protected routes *****************  //
router.get('/fetch-explores',authenticateJWT, exploreController.getExplore);
router.post('/:id/like', authenticateJWT, exploreController.likeExplore);
router.post('/:id/unlike', authenticateJWT, exploreController.unlikeExplore);

// ************** private routes *****************  //
router.post('/update-status/:id',authenticateJWT, exploreController.updateExploreStatus);

router.post('/auth/add',exploreController.exploreData);
router.delete('/auth/delete-explore/:id',exploreController.deleteExplore);
router.post('/auth/update/:id',exploreController.updateExplore);


router.post('/auth/add-new-tag/:id',authenticateJWT, exploreController.addTags);
router.post('/auth/update-tag/:id',authenticateJWT, exploreController.updateTag);
router.delete('/auth/remove-tag/:id',authenticateJWT, exploreController.removeTag);

module.exports= router;
