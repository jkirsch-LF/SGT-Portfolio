const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// Load Ideas Model
require('../models/Classes');
const Classes = mongoose.model('classes');


// Classes Index Page
router.get('/', ensureAuthenticated, (req, res) => {
    Classes.find({ teacher: req.user.id })
        .sort({ semester: 'asc' })
        .then(classes => {
            res.render('classes/index', {
                classes: classes
            });
        })
});

// Add Classes Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('classes/add');
});

// Edit Classes Form
router.get('/edit/:id',(req, res) => {
    Classes.findOne({
        _id: req.params.id
    })
        .then(classes => {
            if (classes.teacher != req.user.id) {
                req.flash('error_msg', 'Not authorized');
                res.redirect('/classes');
            } else {
                res.render('classes/edit', {
                    classes: classes
                });
            }
        });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a Class Name' })
    };

    if (!req.body.semester) {
        errors.push({ text: "Please choose a semester" })
    };

    if (errors.length > 0) {
        res.render('classes/add', {
            errors: errors,
            title: req.body.title,
            semester: req.body.semester
        });
    } else {
        const newClass = {
            title: req.body.title,
            semester: req.body.semester,
            teacher: req.user
        }
        new Classes(newClass)
            .save()
            .then(classes => {
                req.flash('success_msg', 'Class added');
                res.redirect('/classes')
            });
    }
});

// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Classes.findOne({
        _id: req.params.id
    })
        .then(classes => {
            classes.title = req.body.title;
            classes.semester = req.body.semester;
            classes.teacher = req.user

            classes.save()
                .then(classes => {
                    req.flash('success_msg', 'Class updated');
                    res.redirect('/classes');
                });
        });
});

// Delete Classes
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Classes.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Class removed');
            res.redirect('/classes');
        });
});

// Manage Students
router.get('/:id/students', ensureAuthenticated, (req, res) => {
    let classID = (req.params.id).toString();
    Classes.find({
        teacher: req.user,
        class: Classes.classID
    })
        .then((students) => {
            console.log(students);
            res.redirect('/classes/' + req.params.id);
        });
});

module.exports = router;