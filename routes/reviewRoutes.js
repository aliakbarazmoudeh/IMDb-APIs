const express = require('express');
const router = express.Router();

const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');

const {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
} = require('../controllers/reviewController');

router.use(authenticateUser);

router.route('/').get(getAllReviews).post(createReview);

router
  .route('/:id')
  .patch(updateReview)
  .delete(deleteReview);

module.exports = router;
