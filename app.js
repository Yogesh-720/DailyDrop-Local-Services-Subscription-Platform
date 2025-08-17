import express from 'express';
import {PORT} from "./config/env.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Welcome to the Local Services Project.');
})

app.listen(PORT, ()=>{
    console.log(`Local Services API is running on http://localhost:${PORT}`)
})