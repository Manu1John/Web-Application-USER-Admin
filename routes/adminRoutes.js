const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/admin", adminController.getAdminLogin);
router.post("/dashboard", adminController.postAdminLogin);
router.post("/logout", adminController.logoutAdmin);
        
router.get("/dashboard", isAuthenticated, adminController.getDashboard);
router.post("/admin/create", isAuthenticated, adminController.createUser);
router.post("/admin/update/:id", isAuthenticated, adminController.updateUser);
router.post("/admin/delete/:id", isAuthenticated, adminController.deleteUser);

module.exports = router;