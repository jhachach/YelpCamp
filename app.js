const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const app = express();
const Campground = require('./models/campground')
const engine = require('ejs-mate');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
});

// DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!!!!");
})


//Middleware
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//Routes
app.get('/', (req,res) =>{
    res.render('home')
});

app.get('/campgrounds', async(req,res) => {
    const campgrounds = await Campground.find({});

    res.render('campgrounds/index', {campgrounds})
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/create');
})
app.post('/campgrounds', async(req,res) => {
    
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
})

app.put('/campgrounds/:id', async(req, res) => {
    const {id} = req.params

    await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${id}`)

})
app.get('/campgrounds/:id/edit', async(req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
})

app.delete('/campgrounds/:id', async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

})

app.get('/campgrounds/:id', async(req,res) => {
    const {id} = req.params
    const campground = await Campground.findById(id);

    res.render('campgrounds/read', {campground})
})

app.listen(8080, () => {
    console.log("Serving on port 8080");
})