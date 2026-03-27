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
  const error = req.query.error || null;

  let query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }
    : {};

  try {
    const users = await User.find(query);

    if (req.headers["x-requested-with"] === "XMLHttpRequest") {
      return res.json(users);
    }

    let errorMessage = null;

    if (error === "duplicate_user") {
      errorMessage = "Username or email already exists";
    }

    res.render("dashboard", {
      admin: req.session.user,
      users,
      search,
      error: errorMessage
    });

  } catch (err) {
    res.status(500).send("Error loading dashboard");
  }
};exports.createUser = async (req, res) => {
  try {
    const { name, email, Password } = req.body;

    if (!name || !email || !Password) {
      return res.redirect("/dashboard");
    }

    const existingUser = await User.findOne({
      $or: [
        { name: name },
        { email: email }
      ]
    });

    if (existingUser) {
      return res.redirect("/dashboard?error=duplicate_user");
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    await User.create({
      name,
      email,
      Password: hashedPassword
    });

    res.redirect("/dashboard");

  } catch (err) {
    if (err.code === 11000) {
      return res.redirect("/dashboard?error=duplicate_key");
    }
    res.status(500).send("Server error");
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingUser = await User.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { name: name },
        { email: email }
      ]
    });

    if (existingUser) {
      return res.redirect("/dashboard?error=duplicate_user");
    }

    await User.findByIdAndUpdate(req.params.id, { name, email });

    res.redirect("/dashboard");

  } catch (err) {
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