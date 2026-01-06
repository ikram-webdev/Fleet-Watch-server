const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Driver'], default: 'Driver' }
});

// --- PASSWORD ENCRYPTION ---
UserSchema.pre('save', async function () {
    // Agar password change nahi hua to hashing skip karein
    if (!this.isModified('password')) return;

    // Salt generate karein aur password hash karein
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Yahan 'next()' likhne ki zaroorat nahi hai agar function async hai
});

// --- PASSWORD COMPARISON ---
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);