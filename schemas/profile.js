const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MBTI = require('../constants/MBTI');
const ENNEAGRAM = require('../constants/ENNEAGRAM');

const ProfileSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: false,
    default: "",
  },
  mbti: {
    type: String,
    require: false,
    enum: MBTI,
    default: () => MBTI[Math.floor(Math.random() * MBTI.length)]
  },
  enneagram: {
    type: String,
    require: false,
    enum: ENNEAGRAM,
    default: () => ENNEAGRAM[Math.floor(Math.random() * ENNEAGRAM.length)]
  },
  variant: {
    type: String,
    require: false,
    default: "sp/so",
  },
  tritype: {
    type: Number,
    require: false,
    default: () => Math.floor(Math.random() * 1000),
  },
  socionics: {
    type: String,
    require: false,
    trim: true,
    default: "SEE",
  },
  sloan: {
    type: String,
    require: false,
    uppercase: true,
    trim: true,
    default: "RCOEN",
  },
  psyche: {
    type: String,
    require: false,
    uppercase: true,
    trim: true,
    default: "FEVL",
  },
  image: {
    type: String,
    require: false,
    default: "https://soulverse.boo.world/images/1.png",
  },
});


module.exports = mongoose.model("profile", ProfileSchema)

// {
//   "id": 1,
//   "name": "A Martinez",
//   "description": "Adolph Larrue Martinez III.",
//   "mbti": "ISFJ",
//   "enneagram": "9w3",
//   "variant": "sp/so",
//   "tritype": 725,
//   "socionics": "SEE",
//   "sloan": "RCOEN",
//   "psyche": "FEVL",
//   "image": "https://soulverse.boo.world/images/1.png",
// }