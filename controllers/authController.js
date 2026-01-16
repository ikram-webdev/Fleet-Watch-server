const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); 

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '10m' }
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      }
    });

    const resetUrl = `https://fleet-watch-project.vercel.app/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"FleetWatch Admin" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request - FleetWatch',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #00e5ff;">Password Reset Request</h2>
          <p>Aapne password reset ke liye request ki hai. Niche diye gaye link par click karke naya password set karein:</p>
          <a href="${resetUrl}" style="background: #00e5ff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">Ye link sirf 10 minute tak valid hai.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent to your email." });

  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error occurred." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params; 
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });

  } catch (error) {
    console.error("Error in resetPassword:", error);
    if (error.name === 'TokenExpiredError') {
        return res.status(400).json({ message: "Link expired. Please request a new one." });
    }
    res.status(400).json({ message: "Invalid Token." });
  }
};