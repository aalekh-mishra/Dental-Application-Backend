import express from "express";
import { adminLoginWithEmailPassword, adminLogOut, adminRegister, getAdminMyProfile } from "../controllers/admin";
import { adminOnly } from "../middlewares/auth";

const app = express.Router();

// Register as Email and password admin route - /api/v1/user/admin/register
app.post('/admin/register', adminRegister);


// Login as Email and Password route - /api/v1/user/admin/login
app.post('/admin/login', adminLoginWithEmailPassword);

// Logout
app.get('/admin/logout', adminLogOut);


// route - /api/v1/user/me
// After here user must be logged In to access the routes
app.get("/admin/profile/me", adminOnly, getAdminMyProfile);

export default app;