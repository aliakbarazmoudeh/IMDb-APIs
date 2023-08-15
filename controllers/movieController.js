const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const Movie = require('../models/Movie');
const Review = require('../models/Review');

const getAllMovies = async (req, res) => {
  const movies = await Movie.find({});

  res.status(StatusCodes.OK).json({ movies, count: movies.length });
};

const getSingleMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate({
    path: 'reviews',
    select: 'rating title comment user -movie -_id',
    options: {
      limit: 5,
    },
  });
  if (!movie) {
    throw new customError.NotFoundError(
      `cant find any movie with this ID : ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ movie });
};

const createMovie = async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(StatusCodes.CREATED).json({ movie });
};

const updateMovie = async (req, res) => {
  let movie = await Movie.findById(req.params.id);
  if (!movie) {
    throw new customError.NotFoundError('cant find any movie with this ID');
  }
  movie = await Movie.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ success: true, movie });
};

const deleteMovie = async (req, res) => {
  const movie = await Movie.findOne({ _id: req.params.id });
  if (!movie) {
    throw new customError.NotFoundError('cant find any movie with this ID');
  }
  await Movie.findOneAndDelete({ _id: req.params.id });
  res.status(StatusCodes.OK).json({ success: true, movie });
};

module.exports = {
  getAllMovies,
  getSingleMovie,
  createMovie,
  updateMovie,
  deleteMovie,
};
