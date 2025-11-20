const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  profileId: {
    type: Schema.Types.ObjectId,
    require: true,
    index: true,
    ref: "profile",
  },
  senderId: {
    type: Schema.Types.ObjectId,
    require: true,
    index: true,
    ref: "profile",
  },
  title: {
    type: String,
    require: true,
    default: "",
  },
  content: {
    type: String,
    require: true,
    default: "",
  },
  mbti: {
    type: String,
    require: false,
    enum: require('../constants/MBTI'),
  },
  enneagram: {
    type: String,
    require: false,
    enum: require('../constants/ENNEAGRAM'),
  },
  zodiac: {
    type: String,
    require: false,
    enum: require('../constants/ZODIAC'),
  },
  likes: {
    type: [Schema.Types.ObjectId],
    require: false,
    index: true,
    ref: "profile",
  },
  likesCount: {
    type: Number,
    require: false,
    default: 0,
  },
});


module.exports = mongoose.model("comment", CommentSchema)
