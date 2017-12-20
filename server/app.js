
module.exports = function(app) {
  const db = require("./model/models.server");
  require("./service/user.service.server.js")(app);
};
