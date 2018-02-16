var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

ideaSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("ideas", ideaSchema);
