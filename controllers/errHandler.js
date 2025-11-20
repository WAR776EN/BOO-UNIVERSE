exports.errHandler = (err, req, res, next) => {
  switch (err.name) {
    case 'BadRequestError':
      res.status(400).json({
        message: err.message,
        error: err
      });
      return;
    case 'NotFoundError':
      res.status(404).json({
        message: err.message,
      });
      return;
    case 'UnauthorizedError':
      res.status(401).json({
        message: err.message,
      });
      return;
    default:
      res.status(500).json({
        message: err.message,
      });
      return;
  }
}