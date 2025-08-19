import Service from "../models/service.model.js";

export const getAllServices = async (req, res, next) => {
    try {
        const services = await Service.find();
        res.status(200).json({
            success: true,
            count: services.length,
            data: services,
        })
    }
    catch (error) {
        next(error)
    }
}

export const getServiceById = async (req,res,next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            const err = new Error("Service not found");
            err.statusCode = 404;
            throw err;
        }

        res.status(200).json({
            success: true,
            data: service,
        })
    }
    catch (error) {
        next(error)
    }
}

export const createService = async (req, res, next) => {
    try {
        const { name, price, frequencies, description } = req.body;

        const isExisting = await Service.findOne({name});
        if (isExisting) {
            const err = new Error("Service already exists");
            err.statusCode = 409;
            throw err;
        }

        const newService = {
            name,
            price,
            frequencies,
            description,
        }

        const service = await Service.create(newService);

        res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: service,
        })
    }
    catch (error) {
        next(error);
    }
}


export const updateService = async (req, res, next) => {
    try {
        const fields = ["name", "price", "frequencies", "description"];
        const updates = {};

        fields.forEach((field) => {
            if(req.body[field] !== undefined){
                updates[field] = req.body[field];
            }
        })

        const service = await Service.findByIdAndUpdate(req.params.id, updates,{
            new: true,
            runValidators: true,
        });

        if (!service) {
            const err = new Error("Service not found");
            err.statusCode = 404;
            throw err;
        }

        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: service,
        });

    }
    catch (error) {
        next(error);
    }
}

export const deleteService = async (req,res,next) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            const err = new Error("Service not found");
            err.statusCode = 404;
            throw err;
        }

        res.status(200).json({
            success: true,
            message: "Service deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
}

export const seedServices = async (req, res, next) => {
    try {
        const defaultServices = [
            { name: "Milk Delivery", price: 30, frequencies: ["daily"], description: "Fresh milk every day" },
            { name: "Water Can", price: 50, frequencies: ["daily", "weekly"], description: "20L water cans delivered" },
            { name: "Gas Cylinder", price: 900, frequencies: ["monthly"], description: "LPG cylinder home delivery" },
        ];

        await Service.insertMany(defaultServices, { ordered: false }); // skip duplicates
        res.status(201).json({
            success: true,
            message: "Default services seeded successfully",
        });
    } catch (error) {
        next(error);
    }
};
