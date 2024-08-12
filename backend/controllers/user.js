const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../db");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const user = await query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        if (user.length > 0) {
            return res
                .status(400)
                .json({ errors: [{ msg: "User already exists" }] });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await query(
            "INSERT INTO users (user_id,email, password_hash) VALUES (?,?, ?)",
            [uuidv4(), email, passwordHash]
        );

        res.json({ msg: "User registered" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        if (user.length === 0) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Invalid credentials" }] });
        }

        const isMatch = await bcrypt.compare(password, user[0].password_hash);
        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Invalid credentials" }] });
        }

        const payload = {
            user: {
                id: user[0].user_id,
                role: user[0].role,
            },
        };

        jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
            if (err) throw err;
            res.json({ token: token, role: user[0].role });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const getUser = async (req, res) => {
    try {
        const user = await query(
            "SELECT email, role FROM users WHERE user_id = ?",
            [req.user.id]
        );
        res.json(user[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    register,
    login,
    getUser,
};
