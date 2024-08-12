const router = require('express').Router();
const { authenticateJWT } = require('../middleware/auth');
const reviewController = require('../modules/review/controllers/review');


router.get('/fetch', authenticateJWT, reviewController.fetchAllReview);
router.get('/fetch-by-id/:reviewId', authenticateJWT, reviewController.fetchReviewById);
router.get('/fetch-by-explore/:exploreId', authenticateJWT, reviewController.fetchReviewByExploreId);
router.get('/fetch-my-reviews/', authenticateJWT, reviewController.fetchMyReviews);

router.get('/fetch-my-explore-reviews/:exploreId', authenticateJWT, reviewController.fetchMyExploreReviews);


/*****************************private routes ****************************/
router.post('/create', authenticateJWT ,reviewController.createReview);
router.delete('/delete/:id',authenticateJWT , reviewController.deleteReview);
router.put('/update/:reviewId',authenticateJWT, reviewController.updateReview);


router.post('/review-reply',authenticateJWT, reviewController.reviewReply);
router.post('/update-review-reply/:id',authenticateJWT, reviewController.updateReviewReply)

router.post('/:reviewId/like', authenticateJWT, reviewController.likeReview);
router.post('/:reviewId/dislike', authenticateJWT, reviewController.dislikeReview);

module.exports= router;
