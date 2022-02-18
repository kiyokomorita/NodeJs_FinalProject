require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const userRoutes = require('./routes/users');
const touristspotRoutes = require('./routes/touristspots');
const reviewRoutes = require('./routes/reviews');

// mongooseとmongodbのconnection setting
async function main() {
  await mongoose.connect(process.env.MONGODBURL);
  console.log("MONGO CONNECTION OPEN!")
}
main().catch(err => {
  console.log("Connection error")
  console.log(err)
});
// the above is mongooseとmongodbのconnection setting



const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// parse post request of body parts
app.use(express.urlencoded({extended :true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
  secret : 'thisshouldbebettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires : Date.now() + 1000 * 60 * 60* 24* 7,
    masAge: 1000 * 60 * 60* 24* 7
  }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res, next)=>{
  console.log(req.session)
  res.locals.currentUser = req.user;
  res.locals.success= req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


app.use('/', userRoutes);
app.use('/touristspots', touristspotRoutes)
app.use('/touristspots/:id/reviews',reviewRoutes)

app.get('/', (req, res)=>{
  res.render('home')
})





app.all('*', (req,res, next)=>{
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next)=>{
  const {statusCode=500}=err;
  if(!err.message)err.message = 'Oh NO, Something Went Wrong!'
  res.status(statusCode).render('error', {err})
  
})

app.listen(3000, ()=>{
  console.log('Serving on port 3000')
})