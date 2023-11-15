import express from "express";
import mobileCategoryController from "../controller/mobileCategoryController.js";
import tshirtController from "../controller/tshirtController.js";
import flipkart from "../controller/flipkart.js";
const router = express.Router();

router.get("/snapdeal/t-shirt", tshirtController);

router.get("/flipkart/mobile", mobileCategoryController);

router.get("/flipkart/mobile/full", flipkart);

export default router;
