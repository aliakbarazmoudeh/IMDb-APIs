[
  {
    $match: {
      movie: new ObjectId('64d7f41c1f2d54498c96e83c'),
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
];
