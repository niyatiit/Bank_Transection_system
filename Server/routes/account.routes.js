import express from "express"
import { createAccountController, getAccountBalanceController, getUsersAccountsController } from "../controllers/account.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const accountRouter = express.Router();


accountRouter.post("/",authMiddleware,createAccountController);
accountRouter.get("/",authMiddleware,getUsersAccountsController);
accountRouter.get("/balance/:accountId",authMiddleware,getAccountBalanceController);


export default accountRouter
