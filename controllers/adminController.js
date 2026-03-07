const User = require("../models/User");
const bcrypt = require("bcrypt");

const USERNAME = "admin";
const PASSWORD = "1234";

exports.getAdminLogin = (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  res.render("adminlogin", { error: null });
};

exports.postAdminLogin = (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    req.session.user = username;
    res.redirect("/dashboard");
  } else {
    res.render("adminlogin", { error: "Invalid username or password" });
  }
};

exports.logoutAdmin = (req, res) => {
  delete req.session.user;
  res.redirect("/admin");
};

exports.getDashboard = async (req, res) => {
  const search = req.query.search || "";
  let query = search ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] } : {};
  
  const users = await User.find(query);
  if (req.headers["x-requested-with"] === "XMLHttpRequest") return res.json(users);
  
  res.render("dashboard", { admin: req.session.user, users, search });
};

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || await User.findOne({ name })) return res.redirect("/dashboard");

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.insertMany([{ name, email, Password: hashedPassword }]);
  res.redirect("/dashboard");
};

exports.updateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { name: req.body.name, email: req.body.email });
  res.redirect("/dashboard");
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
};