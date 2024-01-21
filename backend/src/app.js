import mongoose from "mongoose";
import express from "express";
import { connectToGoogle} from "./config/googleOAuth"
import session from "express-session";
import routerProduct from "./routers/products"
import routerCategory from "./routers/categories"
import authRouter from "./routers/auth"
import routerCart from "./routers/cart"
import routerOrder from "./routers/order"
import routerUser from "./routers/user"
import routerUpload from "./routers/upload"
import routerEvaluation from "./routers/evalution"
import dotenv from 'dotenv';
import cookieParser from "cookie-parser"

dotenv.config();
import cors from "cors"

const app = express()

app.use(cookieParser());
app.use(express.json())
app.use(cors({ origin: true, credentials: true }));
app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: "SECRET",
    })
  );
app.use("/api", routerProduct)
app.use("/api", authRouter)
app.use("/api", routerCategory)
app.use("/api", routerCart)
app.use("/api", routerOrder)
app.use("/api", routerUser)
app.use("/api", routerUpload)
app.use("/api", routerEvaluation)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
connectToGoogle()
mongoose.connect(process.env.URL)
    .then(() => console.log("connected db"))
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`listening success ${PORT}`);
});