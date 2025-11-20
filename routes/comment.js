'use strict';

const express = require('express');
const router = express.Router();
const controller = require("../controllers/comment")

router.post("/", controller.createComment);
router.get("/", controller.getComments);
router.post("/like", controller.likeComments);
router.post("/unlike", controller.unlikeComments);

module.exports = router