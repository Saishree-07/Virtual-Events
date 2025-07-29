const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    favoriteEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    registeredEvents: [{
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        },
        registrationDate: {
            type: Date,
            default: Date.now
        }
    }],
    profile: {
        fullName: String,
        bio: String,
        interests: [String],
        avatar: String
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
