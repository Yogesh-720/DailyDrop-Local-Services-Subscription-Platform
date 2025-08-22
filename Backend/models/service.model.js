import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Service name is required"],
            trim: true,
            unique: true,
            minlength: 2,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 255,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },
        frequencies: {
            type: [String],
            enum: ["daily", "weekly", "monthly"],
            required: true,
            validate: {
                validator: (val) => val.length > 0,
                message: "At least one frequency must be specified",
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        unit:{
            type: String,
            default: "per item",
        },
        category: {
            type: String,
            enum: ["grocery", "utility", "beverage", "other"],
            default: "other"
        },
        maxQuantity: {
            type: Number,
            default: 5
        }

    },
    { timestamps: true }
);

ServiceSchema.methods.showPublic = function () {
    return {
        id: this._id,
        name: this.name,
        price: this.price,
        isActive: this.isActive,
    };
};

const Service = mongoose.model("Service", ServiceSchema);
export default Service;