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
  
  try {
    const users = await User.find(query);
    if (req.headers["x-requested-with"] === "XMLHttpRequest") return res.json(users);
    res.render("dashboard", { admin: req.session.user, users, search });
  } catch (err) {
    res.status(500).send("Error loading dashboard");
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  // Check if user exists by email (usually safer than name)
  if (!name || !email || !password || await User.findOne({ email })) return res.redirect("/dashboard");

  const hashedPassword = await bcrypt.hash(password, 10);
  // Ensure "password" matches your Schema field name (lowercase 'p' is standard)
  await User.create({ name, email, password: hashedPassword });
  res.redirect("/dashboard");
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.redirect("/dashboard?error=update_failed");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    res.redirect("/dashboard?error=delete_failed");
  }
};