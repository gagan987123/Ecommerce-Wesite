const path = require('path');

const express = require('express');
const productcontroller = require('../controller/product');
const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/',productcontroller.getpostproduct);
router.get('/products',productcontroller.shopproduts);
router.get('/cart',productcontroller.shopcart);
router.post('/cart',productcontroller.postcart);
router.post('/delete-cart-item',productcontroller.deletecartitem);
router.get('/products/:productid',productcontroller.getprodetails);
router.post('/create-order',productcontroller.postorder);
router.get('/orders',productcontroller.getOrders);
router.get('/api/v1/books/export-excel',productcontroller.exel);

module.exports = router;
