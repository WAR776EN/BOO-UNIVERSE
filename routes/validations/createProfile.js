const { body } = require('express-validator');
const MBTIs = require('../../constants/mbtiList.js');

const createProfileValidation = [
  body('fullname')
    .exists().withMessage('Fullname is required'),
  body('description')
    .optional({ nullable: true }),
  body('mbti')
    .exists().withMessage('MBTI code is required')
    .isIn(MBTIs).withMessage('MBTI code is not valid')
    .isLength({ min: 4, max: 4 }).withMessage('MBTI code must be 4 characters long'),
  body('enneagram')
    .exists().withMessage('Enneagram is required'),
  body('variant')
    .exists().withMessage('Variant is required'),
  body('tritype')
    .exists().withMessage('Tritype is required'),
  body('socionics')
    .exists().withMessage('Socionics is required'),
  body('sloan')
    .exists().withMessage('Sloan is required'),
  body('psyche')
    .exists().withMessage('Psyche is required'),
];

module.exports = createProfileValidation;