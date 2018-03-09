const mongoose = require('mongoose');
require('../models/Student');
const Student = mongoose.model('students');

module.exports = {
    select: function (selected, options) {
        return options.fn(this)
            .replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"')
            .replace(new RegExp('>' + selected + '</options>'), 'selected="selected"$&');
    }
}