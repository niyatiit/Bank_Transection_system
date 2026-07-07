import express from "express"
import  {authMiddleware, authSystemUserMiddleware } from "../middleware/auth.middleware.js"
import { createInitialFundsTransection, createTransection } from "../controllers/transection.controller.js"

const transectionRoute = express.Router()

// create new transection
transectionRoute.post("/" , authMiddleware , createTransection)
transectionRoute.post('/system/initial-funds' , authSystemUserMiddleware , createInitialFundsTransection)

export default transectionRoute

