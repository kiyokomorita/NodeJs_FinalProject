require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Touristspot = require('../models/touristspot');

// mongooseとmongodbのconnection setting
async function main() {
  await mongoose.connect(process.env.MONGODBURL);
  console.log("Database connected!")
}
main().catch(err => {
  console.log("Connection error")
  console.log(err)
});
// the above is mongooseとmongodbのconnection setting

const sample = array=>array[Math.floor(Math.random() * array.length)];



const seedDB = async ()=>{
  await Touristspot.deleteMany({});
  for(let i=0; i<50; i++){
    const random1000 = Math.floor(Math.random()*1000);
    const price = Math.floor(Math.random()*20) +10;
    const camp = new Touristspot({
      author:'620ee08bbc0f8c5fddad4887',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image:'https://source.unsplash.com/collection/483251',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus, quidem blanditiis distinctio beatae a perferendis consectetur hic officiis dolorem optio ex ducimus tempora?',
      // short hand priceも変数price, 両方とも同じ場合は一つでよい
      price
    })
    await camp.save()

  }
  
}

seedDB().then(()=>{
  mongoose.connection.close()
})

