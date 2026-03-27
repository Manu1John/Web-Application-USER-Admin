const User = require("../models/User");

// Admin Auth Middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/admin");
  }
}

// User Auth Middleware
async function authenticatedUser(req, res, next) {
  if (!req.session.users) {
    return res.redirect("/");
  }
  const user = await User.findById(req.session.users.id);
  if (!user) {
    return req.session.destroy(() => {
      res.redirect("/");
    });
  }
   req.user = user; // attach fresh DB data
  next();
}

// Cache Disable Middleware
function disableCache(req, res, next) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
}

module.exports = { isAuthenticated, authenticatedUser, disableCache };