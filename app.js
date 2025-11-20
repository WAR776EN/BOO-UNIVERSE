'use strict';
const { dbInit, loadRoutes, serverConfig } = require('./app.config');

// Initialize database
dbInit().catch(err => {
  console.error(err);
  process.exit(1);
});

const { app, port } = serverConfig();
loadRoutes(app);

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(port);
  console.log('Express started. Listening on %s', port);
  module.exports = server;
} else {
  // Export app for testing
  module.exports = app;
}