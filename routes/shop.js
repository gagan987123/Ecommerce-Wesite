const express = require("express");
const productcontroller = require("../controller/product");
const isAuth = require("../middleware/Is-auth");

const router = express.Router();

router.get("/", productcontroller.getpostproduct);
router.get("/products", productcontroller.shopproduts);
router.get("/cart", isAuth, productcontroller.shopcart);
router.post("/cart", isAuth, productcontroller.postcart);
router.post("/delete-cart-item", isAuth, productcontroller.deletecartitem);
router.get("/products/:productid", productcontroller.getprodetails);
router.post("/create-order", isAuth, productcontroller.postorder);
router.get("/orders", isAuth, productcontroller.getOrders);
router.get("/orders/:orderId", isAuth, productcontroller.getInvoice);
module.exports = router;