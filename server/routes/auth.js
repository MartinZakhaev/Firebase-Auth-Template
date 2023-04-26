const express = require("express");

const router = express.Router();

// middlewares
const { authCheck } = require("../middlewares/auth");

// controllers
const { createOrUpdateUser } = require("../controllers/auth");

// routes
router.post("/create-or-update-user", createOrUpdateUser);

module.exports = router;
