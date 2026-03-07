const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res) => {
  if (req.session.users) {
    res.redirect("/home");
  } else {
    res.render("login", { error: null });
  }
};

exports.getSignup = (req, res) => {
  if (req.session.users) {
    res.redirect("/");
  } else {
    res.render("signup", { error: null });
  }
};

exports.postSignup = async (req, res) => {
  try {
    const { Username, Password, Email } = req.body;
    
    // Check if user exists...
    const existUsername = await User.findOne({ name: Username });
    if (existUsername) return res.render("signup", { error: "Username already taken" });

    // Hash password and save
    const hashedPassword = await bcrypt.hash(Password, 10);
    
    // Attempt to save to the database
    const newUser = await User.create({ 
      name: Username, 
      email: Email, 
      Password: hashedPassword // Ensure this matches your Schema exactly!
    });

    console.log("User successfully saved to DB:", newUser); // Success check
    return res.render("signup", { success: "Account created successfully!" });

  } catch (error) {
    // THIS is where we catch the hidden errors!
    console.error("DATABASE SAVE ERROR:", error.message);
    return res.render("signup", { error: "Failed to create account. Check console." });
  }
};
exports.postLogin = async (req, res) => {
  const { Username, Password } = req.body;
  const user = await User.findOne({ name: Username });
  if (!user || !(await bcrypt.compare(Password, user.Password))) {
    return res.render("login", { error: "Invalid username or password" });
  }

  req.session.users = { id: user._id, name: user.name, email: user.email };
  res.render("login", { success: "login success" });
};

exports.getHome = (req, res) => res.render("home", { user: req.session.users });

exports.logoutUser = (req, res) => {
  delete req.session.users;
  res.redirect("/");
};