const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();


const PORT = 3000;

// Mongoose Middleware
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vidjot-dev')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

require('./models/Idea');
const Idea = mongoose.model('ideas');


// HandleBars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method-Override Middleware
app.use(methodOverride('_method'));

// Session-Express MiddleWare
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Connect-Flash Middleware
app.use(flash());

// Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.err = req.flash('error');
    next();
})

// Home Page
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render("index", {
        title: title
    });
});


// About Route
app.get('/about', (req, res) => {
    res.render('about');
})

// Idea Index Page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });

        })
})

// Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
})

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        });
});

// Process Form
app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' })
    };

    if (!req.body.details) {
        errors.push({ text: "Please add some details" })
    };

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video idea added');
                res.redirect('/ideas')
            });
    }
});

// Edit Form Process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video idea updated');
                    res.redirect('/ideas');
                });
        });
})

// Delete Idea
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video idea removed');
            res.redirect('/ideas');
        });
});

//Listener
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});