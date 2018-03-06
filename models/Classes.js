const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'students'
        }
    ]
});

mongoose.model('classes', ClassesSchema);