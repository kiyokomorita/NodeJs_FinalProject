
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Campground = require('./models/campground');

// mongooseとmongodbのconnection setting
async function main() {
  await mongoose.connect('mongodb+srv://kiyoko:mongodb1018@cluster0.zduqs.mongodb.net/yelp-camp');
  console.log("MONGO CONNECTION OPEN!")
}
main().catch(err => {
  console.log("Connection error")
  console.log(err)
});
// the above is mongooseとmongodbのconnection setting



const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// parse post request of body parts
app.use(express.urlencoded({extended :true}))
app.use(methodOverride('_method'));


app.get('/', (req, res)=>{
  res.render('home')
})

app.get('/campgrounds', async(req, res)=>{
  const campgrounds =  await Campground.find({});
  res.render('campgrounds/index', {campgrounds})
})
// 下の'app.get(/campgrounds/:id'....より、こちらが先に来なければならない。下ので止まってしまうため
app.get('/campgrounds/new', (req, res)=>{
  res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res)=>{
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
})


// new の前だとnewを探してしまうので、newはデータがないので、止まってしまう
app.get('/campgrounds/:id', async (req, res)=>{
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', {campground});
})

app.get('/campgrounds/:id/edit', async(req, res)=>{
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/edit', {campground});

})
app.put('/campgrounds/:id', async (req, res)=>{
  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');

})

app.listen(3000, ()=>{
  console.log('Serving on port 3000');
})