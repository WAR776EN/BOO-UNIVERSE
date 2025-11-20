exports.dbInit = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server')
  const mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'boo-world',
    }
  })

  const uri = mongoServer.getUri();
  if (process.env.NODE_ENV !== 'test') {
    console.log('uri', uri);
  }
  const mongoose = require('mongoose');
  await mongoose.connect(uri);
}

exports.loadRoutes = (app) => {
  // health check
  app.get("/", (req, res) => res.json('HELLO FROM BOO WORLD'));

  app.use('/profile', require('./routes/profile'));
  app.use('/comment', require('./routes/comment'));

  app.use("*", require('./controllers/errHandler').errHandler);
}

exports.serverConfig = () => {
  const express = require('express');
  const app = express();
  const port =  process.env.PORT || 3000;

  // set the view engine to ejs
  app.set('view engine', 'ejs');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return { app, port }
}