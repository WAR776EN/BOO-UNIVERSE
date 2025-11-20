'use strict';

const express = require('express');
const router = express.Router();
const controller = require("../controllers/profile")

router.post("/", controller.createProfile);
router.get("/", controller.getManyProfiles);
router.get("/:id", controller.getProfile);

module.exports = router