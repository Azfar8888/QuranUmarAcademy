const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("217006242261-l4g0h2nj4388sq840tbnpi9trvqk8lls.apps.googleusercontent.com");

exports.googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: "217006242261-l4g0h2nj4388sq840tbnpi9trvqk8lls.apps.googleusercontent.com",
    });
    const { email, name } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user with role 'Student' by default
      user = new User({ email, name, role: "Student" });
      await user.save();
    }

    // Generate JWT Token
    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};



// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10); // manually hash here
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     res.status(201).json({ message: "User registered successfully", user: newUser });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the default role of 'Student'
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Student", // Default to Student
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Login User
// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     if (user.twoFactorEnabled) {
//       return res.status(200).json({ message: "2FA Required", userId: user._id });
//     }

//     const token = generateToken(user);
//     res.status(200).json({ message: "Login successful", token, user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }

//   res.status(200).json({
//     token,
//     role: user.role,
//     // ✅ ADD THIS ↓
//     user, // include full user object to access _id on frontend
//   });
// };

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log("Entered:", password);
    console.log("Hashed:", user.password);
    console.log("Match:", await bcrypt.compare(password, user.password));
    
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id,
      user,
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};







// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     //   expiresIn: "30d", // Token expiration time
//     // });

//     // res.status(200).json({
//     //   message: "Login successful",
//     //   token,
//     //   role: user.role,
//     //   userId: user._id, // Return userId in the response
//     // });
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });
    
//     res.status(200).json({
//       message: "Login successful",
//       token,
//       role: user.role,
//       userId: user._id,       // ✅ Keep this
//       user                    // ✅ Add full user object
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Enable Two-Factor Authentication (2FA)
exports.enableTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const secret = speakeasy.generateSecret();
    user.twoFactorSecret = secret.base32;
    user.twoFactorEnabled = true;
    await user.save();

    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url);
    res.status(200).json({ message: "2FA enabled", qrCode: qrCodeDataURL });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify 2FA Code
exports.verifyTwoFactor = async (req, res) => {
  try {
    const { userId, token } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ message: "2FA not enabled" });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token
    });

    if (!isValid) {
      return res.status(401).json({ message: "Invalid 2FA code" });
    }

    const jwtToken = generateToken(user);
    res.status(200).json({ message: "2FA Verified", token: jwtToken, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
