import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

const AddressSchema = new mongoose.Schema({
    label: { type: String, trim: true },
    line1: { type: String, required: true },
    locality: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    pincode: {
        type: String,
        required: true,
        match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode.']
    }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'UserName is required.'],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'UserEmail is required.'],
        unique: [true, 'UserEmail already exist.'],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address.'],

    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number.']
    },
    password: {
        type: String,
        required: [true, 'UserPassword is required.'],
        minlength: 6,
        select: false
    },
    addresses: [AddressSchema],
    notificationPrefs: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        reminderDays: { type: [Number], default: [7, 3, 1] }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpire: { type: Date },


    isPhoneVerified: { type: Boolean, default: false },
    phoneOTP: { type: String },
    phoneOTPExpire: { type: Date },

    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },

}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);

export default User;
