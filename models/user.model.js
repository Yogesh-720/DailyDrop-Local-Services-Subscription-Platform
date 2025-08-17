import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    label: { type: String, trim: true },
    line1: { type: String, required: true },
    locality: { type: String },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
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
        trim: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address.'],
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number.']
    },
    password: {
        type: String,
        required: [true, 'UserPassword is required.'],
        minlength: 6,
    },
    addresses: [AddressSchema],
    notificationPrefs: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        reminderDays: { type: [Number], default: [7, 3] }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);

