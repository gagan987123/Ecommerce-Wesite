const express = require("express");
const isAuth = require('../middleware/Is-auth');
const productcontroller = require("../controller/product");
const router = express.Router();

router.get("/add-product", isAuth, productcontroller.getproduct);
router.post("/add-product", isAuth, productcontroller.addproduct);
router.get("/products", isAuth, productcontroller.adminproduct);
router.get("/edit-product/:productid", isAuth, productcontroller.geteditproduct);
router.post("/edit-product", isAuth, productcontroller.posteditproduct);
router.post("/delete-product/:productid", isAuth, productcontroller.deleteproduct);
exports.routes = router;