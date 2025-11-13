'use strict';

const express = require('express');
const router = express.Router();
const createProfileValidation = require('./validations/createProfile.js');

const profiles = [
  {
    "id": 1,
    "name": "A Martinez",
    "description": "Adolph Larrue Martinez III.",
    "mbti": "ISFJ",
    "enneagram": "9w3",
    "variant": "sp/so",
    "tritype": 725,
    "socionics": "SEE",
    "sloan": "RCOEN",
    "psyche": "FEVL",
    "image": "https://soulverse.boo.world/images/1.png",
  }
];

module.exports = function() {
  router.get('/:id', async function(req, res, next) {
    const profile = await this.db.findOne({
      id: req.params.id,
    });

    res.render('profile_template', { profile });
  });

  router.post('/', createProfileValidation, async function(req, res, next) {
    // const profile = await this.db.create(req.body);
    const profile = req.body;
    console.log(profile);
    res.send(profile);
  });

  return router;
}

