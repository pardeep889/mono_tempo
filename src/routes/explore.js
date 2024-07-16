const router = require('express').Router();
const { authenticateJWT } = require('../middleware/auth');
const exploreController = require('../modules/explore/controllers/explore');

// ************** public routes *****************  //
router.get('/get-explore-by-id/:id',exploreController.getExploreById);

router.get('/fetch-explores',authenticateJWT, exploreController.getExplore);





// ************** private routes *****************  //
router.post('/auth/add',exploreController.exploreData);
router.delete('/auth/delete-explore/:id',exploreController.deleteExplore);
router.post('/auth/update/:id',exploreController.updateExplore);


router.post('/auth/update-tag/:id',exploreController.updateTag);
router.post('/auth/add-new-tag/:id',exploreController.addTags);
router.delete('/auth/remove-tag/:id',exploreController.removeTag);

module.exports= router;
