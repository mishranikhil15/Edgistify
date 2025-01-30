const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authentication token is required" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "unique");
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token Verification Error:", error.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = authenticateUser;
