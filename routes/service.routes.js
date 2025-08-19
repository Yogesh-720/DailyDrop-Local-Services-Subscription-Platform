import { Router } from "express";
import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    seedServices,
} from "../controllers/service.controller.js";
import { authorize, authorizeAdmin } from "../middlewares/auth.middleware.js";

const serviceRouter = Router();


// ------------------- User Routes ------------------- //

// GET /api/v1/services → list all services
serviceRouter.get("/", authorize, getAllServices);

// GET /api/v1/services/:id → get service details
serviceRouter.get("/:id", authorize, getServiceById);

// ------------------- Admin Routes ------------------- //

// POST /api/v1/services → create new service
serviceRouter.post("/", authorize, authorizeAdmin, createService);

// PATCH /api/v1/services/:id → update service
serviceRouter.patch("/:id", authorize, authorizeAdmin, updateService);

// DELETE /api/v1/services/:id → delete service
serviceRouter.delete("/:id", authorize, authorizeAdmin, deleteService);

// POST /api/v1/services/seed → seed default services
serviceRouter.post("/seed", authorize, authorizeAdmin, seedServices);

export default serviceRouter;
