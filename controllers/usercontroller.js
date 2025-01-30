const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usermodel } = require("../model/usermodel");

// Register a new user
const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // Check if the email already exists
        const existingUser = await Usermodel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = new Usermodel({ fullName, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: "Error in registering the user" });
    }
};

// User login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await Usermodel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user?._id }, "unique", { expiresIn: "7d" });

        res.json({ message: "Login successful", token, fullName: user.fullName, userId: user?._id });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: "Error in logging in the user" });
    }
};

module.exports = {
    registerUser,
    loginUser
};
