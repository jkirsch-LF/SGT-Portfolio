const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    studentId: {
        type: Number,
        required: true
    },
    classes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'classes'
        }
    ]
});

mongoose.model('students', StudentSchema);