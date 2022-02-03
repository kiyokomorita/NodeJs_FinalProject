const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

// mongooseとmongodbのconnection setting
async function main() {
  await mongoose.connect('mongodb+srv://kiyoko:mongodb1018@cluster0.zduqs.mongodb.net/yelp-camp');
  console.log("Database connected!")
}
main().catch(err => {
  console.log("Connection error")
  console.log(err)
});
// the above is mongooseとmongodbのconnection setting

const sample = array=>array[Math.floor(Math.random() * array.length)];



const seedDB = async ()=>{
  await Campground.deleteMany({});
  for(let i=0; i<50; i++){
    const random1000 = Math.floor(Math.random()*1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`
    })
    await camp.save()

  }
  
}

seedDB().then()=>{
  mongoose.connection.close()
}

