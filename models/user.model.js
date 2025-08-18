import mongoose from 'mongoose';

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
        trim: true,
        sparse: true,
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
        select: false // prevent accidental exposure
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
    }
}, { timestamps: true });

UserSchema.pre("validate", function (next) {
    if (!this.email && !this.phone) {
        next(new Error("Either email or phone is required"));
    } else {
        next();
    }
});


export const User = mongoose.model('User', UserSchema);
