const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// Load Ideas Model
require('../models/Classes');
const Classes = mongoose.model('classes');
require('../models/Student');
const Students = mongoose.model('students');

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

// Add Students
router.get('/add/:id', ensureAuthenticated, (req, res) => {
    Classes.findOne({
        teacher: req.user,
        _id: req.params.id
    })
        .then((classObj) => {
            Students.find()
                .then((studentsArr) => {

                    const firstRan = (Math.floor(Math.random() * 10) + 10);

                    for (let i = 0; i < firstRan; i++) {

                        let rndNum = Math.floor(Math.random() * 49);

                        Classes.update(
                            { _id: classObj._id },
                            { $addToSet: { students: studentsArr[rndNum] } },
                            { upsert: true },
                            function (err, raw) {
                                console.log(raw);
                            });
                        Students.update(
                            { _id: studentsArr[rndNum]._id },
                            { $addToSet: { classes: classObj } },
                            { upsert: true },
                            function (err, raw) {
                                console.log(raw);
                            });
                    }
                    
                    req.flash('success_msg', 'Students Added');
                    res.redirect('/classes');
                })

        });
});

// Delete Classes
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Students.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Student removed');
            res.redirect('../classes/')
        });
});

module.exports = router;