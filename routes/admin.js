const express = require("express");
const productcontroller = require("../controller/product");
const router = express.Router();

router.get("/add-product", productcontroller.getproduct);
router.post("/add-product", productcontroller.addproduct);
router.get("/products", productcontroller.adminproduct);
router.get("/edit-product/:productid", productcontroller.geteditproduct);
router.post("/edit-product", productcontroller.posteditproduct);
router.post("/delete-product/:productid", productcontroller.deleteproduct);
exports.routes = router;
