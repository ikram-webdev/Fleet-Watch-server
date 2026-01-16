const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Apne User model ka sahi path check kar lein

// 1. Forgot Password Function
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check karein ke user database mein hai ya nahi
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Is email ka koi user mojood nahi hai." });
    }

    // Ek temporary token banayein (10 minutes ke liye valid)
    const resetToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '10m' }
    );

    // NodeMailer Transporter Setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Aapki email (.env se)
        pass: process.env.EMAIL_PASS  // Aapka App Password (.env se)
      }
    });

    // Reset Link (Frontend ka URL)
    // Note: Localhost ko production URL se replace karein jab deploy karein
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
    res.status(200).json({ message: "Reset link aapki email par bhej diya gaya hai." });

  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server mein masla aa gaya hai." });
  }
};