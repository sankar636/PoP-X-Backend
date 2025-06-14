import connectDataBase from "./database/index.js";
import { app } from "./app.js";

import dotenv from "dotenv";
dotenv.config({
    path: './.env'
});


connectDataBase()
    .then(() => {
        // console.log('Database connected successfully');        
        app.listen(process.env.PORT || 5000, () => {
            console.log(`MongoDB connected successfully on the port ${process.env.PORT || 5000}`);
            console.log(`server running on the port http://localhost:${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("MongoDB connection failed !!!", error)
    })