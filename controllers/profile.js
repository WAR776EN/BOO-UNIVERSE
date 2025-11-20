const profileModel = require('../schemas/profile');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { createProfileSchemaValidation, getProfileSchemaValidation } = require('../utils/request-validation/profile');

module.exports = {
  async createProfile(req, res, next) {
    try {
      const { error } = createProfileSchemaValidation.validate(req.body);
      if (error) {
        throw new BadRequestError(error);
      }

      const profile = await profileModel.create(req.body);
      res.status(201).json({
        message: "Profile created",
        data: profile,
      });

    }
    catch(err) {
      next(err)
    }
  },

  async getManyProfiles(req, res, next) {
    try {
      const profiles = await profileModel.find();
      res.status(200).json({
        message: "Profiles fetched",
        data: profiles,
      });
    }
    catch(err) {
      throw err
    }
  },
  
  async getProfile(req, res, next) {
    try {
      const { error } = getProfileSchemaValidation.validate(req.params);
      if (error) {
        throw new BadRequestError(error);
      }

      const profile = await profileModel.findById(req.params.id);
      if (!profile) {
        throw new NotFoundError("Profile not found");
      }
      
      res.render('profile_template', {
        profile,
      });
    }
    catch(err) {
      next(err)
    }
  }
};