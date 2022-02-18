const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Touristspot = require('../models/touristspot');


const {isLoggedIn, isAuthor, validateTouristspot} = require('../middleware')



router.get('/', catchAsync(async(req, res)=>{
  const touristspots =  await Touristspot.find({});
  res.render('touristspots/index', {touristspots})
}))
// 下の'app.get(/touristspots/:id'....より、こちらが先に来なければならない。下ので止まってしまうため
router.get('/new',isLoggedIn, (req, res)=>{
  res.render('touristspots/new');
})

router.post('/', isLoggedIn, validateTouristspot, catchAsync(async (req, res, next)=>{
   
  // if(!req.body.touristspot) throw new ExpressError('Invalid Touristspot Data', 400);
    const touristspot = new Touristspot(req.body.touristspot);
    touristspot.author = req.user._id;
    await touristspot.save();
    req.flash('success', 'Successfully made a new touristspot');
    res.redirect(`/touristspots/${touristspot._id}`)
  
  
}))


// new の前だとnewを探してしまうので、newはデータがないので、止まってしまう
router.get('/:id', catchAsync(async (req, res)=>{
  const touristspot = await Touristspot.findById(req.params.id).populate({
    path:'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  console.log(touristspot);
  if(!touristspot){
    req.flash('error', 'Cannot find that touristspot!');
    return res.redirect('/touristspots');
  }
  res.render('touristspots/show', {touristspot});
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res)=>{
  const {id} = req.params;
  const touristspot = await Touristspot.findById(id)
  
  if(!touristspot){
    req.flash('error', 'Cannot find that touristspot!');
    return res.redirect('/touristspots');
  }
 
  res.render('touristspots/edit', {touristspot});

}))
router.put('/:id', isLoggedIn, isAuthor, validateTouristspot, catchAsync(async (req, res)=>{
  const {id} = req.params;
 const touristspot = await Touristspot.findByIdAndUpdate(id, {...req.body.touristspot});
  req.flash('success', 'Successfully updated touristspot!')
  res.redirect(`/touristspots/${touristspot._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res)=>{
  const {id} = req.params;
  await Touristspot.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted touristspot')
  res.redirect('/touristspots');

}));

module.exports = router;