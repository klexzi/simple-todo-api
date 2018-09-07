const signup = require("../routes/signup");
const login = require("../routes/login");
const logout = require("../routes/logout");
const todo = require("../routes/todo");
const changePassword = require("../routes/changePassword");

/*
*@params {app} an instance of express
*/
module.exports = app => {
  app.use("/api/signup", signup);
  app.use("/api/login", login);
  app.use("/api/logout", logout);
  app.use("/api/todo", todo);
  app.use("/api/change-password", changePassword);

  // catch invalid endpoint request
  app.use((req, res) => {
    res.status(404).send("EndPoint Not Found");
  });
};
