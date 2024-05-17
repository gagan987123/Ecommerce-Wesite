const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const productcontroller = require('../controller/product');
const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product',productcontroller.getproduct);

// /admin/add-product => POST
router.post('/add-product',productcontroller.addproduct);
router.get('/product',productcontroller.adminproduct);
router.get('/edit-product/:productid',productcontroller.geteditproduct);
router.post('/edit-product',productcontroller.posteditproduct);
router.post('/delete-product',productcontroller.deleteproduct);
exports.routes = router;
exports.products = products;
