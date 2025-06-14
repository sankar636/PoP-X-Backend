import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.use(cors({
    origin: `https://po-p-x-frontend-7pqt.vercel.app/`,
    credentials: true
}))
console.log(process.env.CORS_ORIGIN);

app.use(express.json({
    limit: "50kb"
}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))

app.use(cookieParser())
app.get("/", (req, res) => {
    res.send("Server is up and running 🚀");
});

import userRouter from './routes/user.routes.js'
app.use('/user', userRouter)

export { app }