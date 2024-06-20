const router = require('express').Router();
const { authenticateJWT } = require('../middleware/auth');
const reviewController = require('../modules/review/controllers/review');


router.get('/fetch', authenticateJWT, reviewController.fetchAllReview);
router.get('/fetch-by-id/:reviewId', authenticateJWT, reviewController.fetchReviewById);


/*****************************private routes ****************************/
router.post('/create', authenticateJWT ,reviewController.createReview);
router.delete('/delete/:id',authenticateJWT , reviewController.deleteReview);
router.put('/update/:reviewId',authenticateJWT, reviewController.updateReview);


router.post('/review-reply/:id',authenticateJWT, reviewController.reviewReply);
router.post('/update-review-reply/:id',authenticateJWT, reviewController.updateReviewReply)


module.exports= router;
