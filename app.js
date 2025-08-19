import express from 'express';
import {PORT} from "./config/env.js";
import morgan from "morgan";
import connectToDatabase from "./database/mongodb.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev")); // logger


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send("<h1>Welcome to the local services project </h1>");
})

const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Local Services API is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1); // exit if DB not connected
    }
};

startServer().catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
});
