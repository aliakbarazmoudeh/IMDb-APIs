const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide review title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please provide review text'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    movie: {
      type: mongoose.Schema.ObjectId,
      ref: 'Movie',
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

reviewSchema.static('calculateAvrageRating', async function (movieID) {
  const agg = await this.aggregate([
    {
      $match: {
        movie: movieID,
      },
    },
    {
      $group: {
        _id: null,
        avrageRating: {
          $avg: '$rating',
        },
        numOfReviews: {
          $sum: 1,
        },
      },
    },
  ]);
  const result = await mongoose.model('Movie').findOneAndUpdate(
    { _id: movieID },
    {
      numOfReviews: agg[0]?.numOfReviews || 0,
      avrageRating: agg[0]?.avrageRating || 0,
    },
    { new: true }
  );
});

reviewSchema.post('findOneAndUpdate', async function (doc) {
  doc.constructor.calculateAvrageRating(doc.movie);
});

reviewSchema.post('save', async function (doc) {
  doc.constructor.calculateAvrageRating(doc.movie);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  doc.constructor.calculateAvrageRating(doc.movie);
});

module.exports = mongoose.model('Review', reviewSchema);
