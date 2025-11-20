const { BadRequestError } = require('../utils/errors');
const profileModel = require('../schemas/profile');
const commentModel = require('../schemas/comment');
const { createCommentSchema, getCommentsSchema, likeCommentsSchema, unlikeCommentsSchema } = require('../utils/request-validation/comment');

module.exports = {
  async createComment(req, res, next) {
    try {
      const { error } = createCommentSchema.validate(req.body);
      if (error) {
        throw new BadRequestError(error);
      }

      const profile = await commentModel.findById(req.body.profileId);
      if (!profile) {
        throw new BadRequestError("Profile ID not found");
      }

      const sender = await profileModel.findById(req.body.senderId);
      if (!sender) {
        throw new BadRequestError("Sender ID not found");
      }

      const comment = await commentModel.create(req.body);
      res.status(201).json({
        message: "Comment created",
        data: comment,
      });

    }
    catch(err) {
      next(err)
    }
  },

  async getComments(req, res, next) {
    try {
      const { pid, filters } = req.query;
      const { error } = getCommentsSchema.validate({ pid, filters });
      if (error) {
        throw new BadRequestError(error);
      }

      // filters will contain either mbti, enneagram, or zodiac
      // in comma separated string
      // if no filters, return all comments
      const filterObj = {};
      if (filters) {
        filters.split(",").forEach((filter) => {
          filterObj[filter] = { $exists: true };
        });
      }

      const comments = await commentModel.find({ profileId: pid, ...filterObj });
      
      res.status(200).json({
        message: "Comments fetched",
        data: comments,
      });
    }
    catch(err) {
      throw err
    }
  },

  async likeComments(req, res, next) {
    try {
      const { cid, userId } = req.body;
      const comment = await commentModel.findById(cid);
      if (!comment) {
        throw new BadRequestError("Comment ID not found");
      }

      if (comment.likes.includes(userId)) {
        throw new BadRequestError("You already liked this comment");
      }

      comment.likes.push(userId);
      comment.likesCount += 1;
      await comment.save();

      res.status(200).json({
        message: "Comment liked",
        data: comment,
      });
    }
    catch(err) {
      next(err)
    }
  },

  async unlikeComments(req, res, next) {
    try {
      const { cid, userId } = req.body;

      const comment = await commentModel.findById(cid);
      if (!comment) {
        throw new BadRequestError("Comment not found");
      }

      if (!comment.likes.includes(userId)) {
        throw new BadRequestError("You have not liked this comment");
      }

      comment.likes = comment.likes.filter((id) => id != userId);
      // if likesCount is 0, don't decrement
      comment.likesCount -= comment.likesCount > 0 ? 1 : 0;
      await comment.save();

      res.status(200).json({
        message: "Comment unliked",
        data: comment,
      });
    }
    catch(err) {
      next(err)
    }
  },
};