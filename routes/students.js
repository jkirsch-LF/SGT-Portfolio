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

router.post('/:id', ensureAuthenticated, (req, res) => {
    Classes.findById(req.params.id)
        .then((classFound) => {
            Students.findById(req.body.id)
                .then((student) => {
                    Classes.update(
                        { _id: req.params.id },
                        { $addToSet: { students: student } },
                        function (err, results) {
                            
                            if (results.nModified > 0) {
                                Students.update(
                                    { _id: student },
                                    { $addToSet: { classes: classFound } },
                                    { upsert: true },
                                    function (err, raw) {
                                        req.flash('success_msg', `Added ${student.firstName} to ${classFound.title}`);
                                        res.redirect('/classes');
                                    });
                            } else {
                                req.flash('error_msg', 'Failed to add student');
                                res.redirect('/classes');
                            }
                        }
                    )
                })
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
                .then((students) => {

                    const firstRan = (Math.floor(Math.random() * 10) + 10);
                    let studentArr = [];

                    for (let i = 0; i < firstRan; i++) {
                        let rndNum = Math.floor(Math.random() * 49);
                        studentArr.push(students[rndNum]);
                    }

                    Classes.update(
                        { _id: classObj._id },
                        { $addToSet: { students: { $each: studentArr } } },
                        { upsert: true },
                        function (err, raw) {
                            console.log(raw);
                        });

                    Students.updateMany(
                        { _id: studentArr },
                        { $addToSet: { classes: classObj } },
                        { upsert: true },
                        function (err, raw) {
                            console.log(raw);
                        });

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