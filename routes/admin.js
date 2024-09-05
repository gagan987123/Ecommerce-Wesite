const express = require("express");
const isAuth = require("../middleware/Is-auth");
const productcontroller = require("../controller/product");
const { body } = require("express-validator");
const router = express.Router();

router.get("/add-product", isAuth, productcontroller.getproduct);
router.post(
  "/add-product",
  isAuth,
  [
    body("title").isAlphanumeric().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
  ],
  productcontroller.addproduct
);
router.get("/products", isAuth, productcontroller.adminproduct);
router.get(
  "/edit-product/:productid",
  isAuth,
  productcontroller.geteditproduct
);
router.post(
  "/edit-product",
  isAuth,
  [
    body("title").isAlphanumeric().isLength({ min: 3 }).trim(),

    body("price").isFloat(),
  ],
  productcontroller.posteditproduct
);
router.post(
  "/delete-product/:productid",
  isAuth,
  productcontroller.deleteproduct
);
exports.routes = router;
