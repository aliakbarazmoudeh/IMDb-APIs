const mongoose = require('mongoose');
const Review = require('./Review');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title of movie must be provided'],
    },
    poster: {
      type: String,
      required: [true, 'poster of movie must be provided'],
    },
    year: {
      type: String,
      required: [true, 'year of movie must be provided'],
    },
    released: {
      type: String,
      required: [true, 'released date must be provided'],
    },
    runtime: {
      type: String,
      required: [true, 'runtime of movie must be provided'],
    },
    director: {
      type: String,
      required: [true, 'please enter director of movie'],
    },
    writer: {
      type: String,
      required: [true, 'please enter writer of movie'],
    },
    actors: {
      type: String,
      required: [true, 'please enter actors of movie'],
    },
    plot: {
      type: String,
      required: [true, 'please enter plot of movie'],
    },
    country: {
      type: String,
      required: [true, 'please enter country of movie'],
    },
    awards: {
      type: String,
      required: [true, 'please enter awards of movie'],
    },
    metascore: {
      type: String,
      required: [true, 'please enter metascore of movie'],
    },
    imdb_rating: {
      type: String,
      required: [true, 'please enter imdb rating of movie'],
    },
    avrageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['movie', 'series'],
      required: [true, 'please enter type of your file'],
    },
    genres: {
      type: [],
      required: [true, 'please provide genres of your movie'],
    },
    images: {
      type: [],
      required: [true, 'pleas provide images for your movie'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

movieSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'movie',
  justOne: false,
});

movieSchema.index({ title: 1, director: 1 }, { unique: true });

movieSchema.post('findOneAndDelete', async function (doc) {
  await mongoose.model('Review').deleteMany({ movie: doc._id });
});

module.exports = mongoose.model('Movie', movieSchema);
