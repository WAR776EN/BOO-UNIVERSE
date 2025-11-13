


async function createProfile(req, res, next) {
  const profile = await this.db.create(req.body);
  res.send(profile);
}


module.exports = {
  createProfile,
};