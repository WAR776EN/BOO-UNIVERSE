const Joi = require('joi');

const createProfileSchemaValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  mbti: Joi.string().allow(''),
  enneagram: Joi.string().allow(''),
  variant: Joi.string().allow(''),
  tritype: Joi.number().allow(''),
  socionics: Joi.string().allow(''),
  sloan: Joi.string().allow(''),
  psyche: Joi.string().allow(''),
  image: Joi.string().allow(''),
});

const getProfileSchemaValidation = Joi.object({
  id: Joi.string().required()
    .hex().message('Invalid mongoID')
    .length(24).message('Invalid mongoID')
});

module.exports = {
  createProfileSchemaValidation,
  getProfileSchemaValidation,
}