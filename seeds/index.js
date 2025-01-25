const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers') 

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!!!!");
});


const seed = async() => {
    await Campground.deleteMany({});

    for(let i =0; i < 100; i++){
        const rand =  Math.floor(Math.random() *1000);
        const city = cities[rand];
        const price = Math.floor(Math.random() *30) + 10
        const newCamp = new Campground({
            location: `${city.city}, ${city.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            price: price,
            description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus voluptas veniam, recusandae est, ducimus enim quos earum, optio exercitationem asperiores maiores saepe odit ex veritatis? Natus itaque voluptates incidunt dolorum.'
        })
        await newCamp.save();
    }

};

const sample = (array) => array[Math.floor(Math.random() * array.length)] 

seed().then(() => {
    db.close()
});


//    image: `https://picsum.photos/400?random=${Math.random()}`,