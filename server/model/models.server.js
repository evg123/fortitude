const mongoose = require('mongoose');

let connectionString = 'mongodb://127.0.0.1:27017/test'; // for local
if (process.env.MLAB_USERNAME) {
  // running remotely
  const username = process.env.MLAB_USERNAME;
  const password = process.env.MLAB_PASSWORD;
  connectionString = 'mongodb://' + username + ':' + password;
  connectionString += '@ds257495.mlab.com:57495/heroku_zlqr6hw8';
}

mongooseOpts = { useMongoClient: true };
const db = mongoose.connect(connectionString, mongooseOpts);

module.exports = db;
