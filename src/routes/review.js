const router = require('express').Router();
const reviewController = require('../modules/review/controllers/review');


/*****************************public routes ****************************/
router.get('/fetch', reviewController.fetchAllReview);
router.get('/fetch-by-id/:reviewId', reviewController.fetchReviewById);


/*****************************private routes ****************************/
router.post('/create',reviewController.createReview);
router.delete('/delete/:id',reviewController.deleteReview);
router.put('/update/:reviewId', reviewController.updateReview);
router.post('/review-reply/:id',reviewController.reviewReply);
router.post('/update-review-reply/:id',reviewController.updateReviewReply)


module.exports= router;
