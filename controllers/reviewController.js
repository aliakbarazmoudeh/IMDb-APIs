const Review = require('../models/Review');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const checkPermission = require('../utils/checkPermission');

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({ path: 'movie' });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const createReview = async (req, res) => {
  const review = await Review.create({ ...req.body, user: req.user.userID });
  res.status(StatusCodes.CREATED).json({ review });
};

const updateReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review)
    throw new customError.NotFoundError('cant find any review with this ID');
  checkPermission(req.user, review.user.toString());
  await Review.findOneAndUpdate(
    { _id: req.params.id, movie: review.movie },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(StatusCodes.OK).json({ success: true, review });
};

const deleteReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review)
    throw new customError.NotFoundError(
      'please cant find any review with this ID'
    );
  checkPermission(req.user, review.user.toString());
  await Review.findOneAndDelete(review);
  res.status(StatusCodes.OK).json({ success: true, review });
};

module.exports = {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
};
