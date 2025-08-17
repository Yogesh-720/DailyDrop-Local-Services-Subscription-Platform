import express from 'express';
import {PORT} from "./config/env.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send("<h1>Welcome to the local services project </h1>");
})

app.get('/api', (req, res) => {
    res.send('Welcome');
})

app.listen(PORT, ()=>{
    console.log(`Local Services API is running on http://localhost:${PORT}`)
})