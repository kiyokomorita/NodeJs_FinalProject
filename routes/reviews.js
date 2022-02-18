const express = require('express');
const router = express.Router({mergeParams : true});
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const Touristspot = require('../models/touristspot');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


router.post('/', isLoggedIn,  validateReview, catchAsync(async(req, res)=> {
  const touristspot = await Touristspot.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  touristspot.reviews.push(review);
  await review.save();
  await touristspot.save();
  req.flash('success', 'Created new review!');
  res.redirect(`/touristspots/${touristspot._id}`);

}))
router.delete('/:reviewId', isLoggedIn,isReviewAuthor, catchAsync(async (req, res)=>{
  const { id, reviewId} = req.params;
  await Touristspot.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted review!');
  res.redirect(`/touristspots/${id}`);
}))


module.exports = router;