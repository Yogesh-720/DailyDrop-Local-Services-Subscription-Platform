import { Router } from "express";
import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    seedServices, searchServices, deactivateService, activateService, bulkCreateServices, bulkUpdateServices,
} from "../controllers/service.controller.js";
import { authorize, authorizeAdmin } from "../middlewares/auth.middleware.js";

const serviceRouter = Router();


// GET /api/v1/services → list all services
serviceRouter.get("/", authorize, getAllServices);

// GET /api/v1/services/:id → get service details
serviceRouter.get("/:id", authorize, getServiceById);

// GET /api/v1/services/search?name=Milk → search by name
serviceRouter.get("/search", authorize, searchServices);




// POST /api/v1/services → create new service
serviceRouter.post("/", authorize, authorizeAdmin, createService);

// PATCH /api/v1/services/:id → update service
serviceRouter.patch("/:id", authorize, authorizeAdmin, updateService);

// DELETE /api/v1/services/:id → delete service
serviceRouter.delete("/:id", authorize, authorizeAdmin, deleteService);

// PATCH /api/v1/services/:id/deactivate → soft delete (isActive = false)
serviceRouter.patch("/:id/deactivate", authorize, authorizeAdmin, deactivateService);

// PATCH /api/v1/services/:id/activate → reactivate (isActive = true)
serviceRouter.patch("/:id/activate", authorize, authorizeAdmin, activateService);

// POST /api/v1/services/bulk → add multiple services
serviceRouter.post("/bulk", authorize, authorizeAdmin, bulkCreateServices);

// PATCH /api/v1/services/bulk → update multiple services
serviceRouter.patch("/bulk", authorize, authorizeAdmin, bulkUpdateServices);

// POST /api/v1/services/seed → seed default services
serviceRouter.post("/seed", authorize, authorizeAdmin, seedServices);

export default serviceRouter;
