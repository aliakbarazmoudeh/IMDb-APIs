const express = require('express');
const router = express.Router();
const {
  createMovie,
  deleteMovie,
  getAllMovies,
  getSingleMovie,
  updateMovie,
} = require('../controllers/movieController');
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');

router.use(authenticateUser);

router
  .route('/')
  .get(getAllMovies)
  .post(authorizePermission('admin'), createMovie);

router
  .route('/:id')
  .get(getSingleMovie)
  .patch(authorizePermission('admin'), updateMovie)
  .delete(authorizePermission('admin'), deleteMovie);

module.exports = router;
