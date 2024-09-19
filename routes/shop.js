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
router.get("/orders", isAuth, productcontroller.getOrders);
router.get("/orders/:orderId", isAuth, productcontroller.getInvoice);
router.get("/checkout", isAuth, productcontroller.getCheckout);
router.get("/checkout/success", isAuth, productcontroller.postorder);
router.get("/checkout/cancle", isAuth, productcontroller.getCheckout);

module.exports = router;
