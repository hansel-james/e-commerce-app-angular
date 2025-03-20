import express from "express";
import fileUpload from "express-fileupload";
import { getProducts, addProduct, getCategories } from "../controllers/product.controller";

const router = express.Router();

// Middleware for handling file uploads
router.use(fileUpload());

router.get("/", getProducts);
router.post("/", addProduct);
router.get("/categories", getCategories)

export default router;
