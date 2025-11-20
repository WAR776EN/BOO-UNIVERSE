const Joi = require('joi');

const createCommentSchema = Joi.object({
  profileId: Joi.string().required().hex().message('Invalid mongoID').length(24).message('Invalid mongoID'),
  senderId: Joi.string().required().hex().message('Invalid mongoID').length(24).message('Invalid mongoID'),
  title: Joi.string().required(),
  content: Joi.string().required(),
  mbti: Joi.string().allow([''].concat(require('../../constants/MBTI')).join(',')),
  // .valid(require('../../constants/MBTI')),
  enneagram: Joi.string().allow([''].concat(require('../../constants/ENNEAGRAM')).join(',')),
  // .valid(require('../../constants/ENNEAGRAM')),
  zodiac: Joi.string().allow([''].concat(require('../../constants/ZODIAC')).join(',')),
  // .valid(require('../../constants/ZODIAC')),
});

const getCommentsSchema = Joi.object({
  pid: Joi.string().required().hex().message('Invalid mongoID').length(24).message('Invalid mongoID'),
  filters: Joi.string().allow(''),
});

const likeCommentsSchema = Joi.object({
  cid: Joi.string().required().hex().message('Invalid mongoID').length(24).message('Invalid mongoID'),
  userId: Joi.string().required().hex().message('Invalid mongoID').length(24).message('Invalid mongoID'),
});

module.exports = {
  createCommentSchema,
  getCommentsSchema,
  likeCommentsSchema,
}