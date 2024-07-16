const product = require("../modles/products");
const Product = require("../modles/products");
const carts = require("../modles/cart");
const { where } = require("sequelize");
const { products } = require("../routes/admin");
const CartItem = require("../modles/cart-item");
const path = require("../util/path");
const mysql = require('../util/database'); // Use mysql2 library for promises
const XLSX = require('xlsx');

exports.exel=async(req,res)=>{
    try{
        const [rows,fields]= await mysql.query("select * from orderitems");
        const heading = [[ 'id ', 'quantity', ' createdAt' ,'updatedAt' ,'orderId' ,'productId']]
        rows.forEach(row => {
          row.createdAt = new Date(row.createdAt).toLocaleString();
          row.updatedAt = new Date(row.updatedAt).toLocaleString();
      });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(worksheet, heading);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'books');
    
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    
        res.attachment('orders-items.xlsx');
        return res.send(buffer);
        res.json({msg:'ok',data:rows});

      }catch(err){
      console.log(err);
    }

}


exports.getproduct = (req, res, next) => {
  req.user
  .getProducts()
  .then(products => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false
    });
  })
  .catch(err => console.log(err));
};



exports.geteditproduct = (req, res, next) => {
  const editmode = req.query.edit;
  if (!editmode) {
    return res.redirect("/");
  }
  const proid = req.params.productid;
  // product.findByPk(proid)
  req.user.getProducts({where: {id:proid}})
  
  .then((products) => {
    const product = products[0];
    

    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: editmode,
      product: product,
    });
  });
};




exports.deleteproduct = (req, res, next) => {
  const productid = req.params.productid;
 
  // product.delete(productid).then().catch(err=>{console.log(err)});
  product
    .findByPk(productid)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("destroyed product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};




exports.posteditproduct = (req, res, next) => {
  const productid = req.body.productid;
  const updatedtitle = req.body.title;
  const updatedprice = req.body.price;
  const updatedImageurl = req.body.imageurl;
  const updateddesc = req.body.description;
console.log(productid);
  // const updatedProduct = new product(productid,updatedtitle,updatedImageurl,updateddesc,updatedprice);
  // updatedProduct.save();
  product
    .findByPk(productid)
    .then((product) => {
      if (!product) {
        // Handle the case where product is not found
        return res.status(404).send('Product not found');
      }
      product.title = updatedtitle;
      product.price = updatedprice;
      product.imageurl = updatedImageurl;
      product.description = updateddesc;
      return product.save();
    })
    .then((result) => {
      console.log("updated");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};




exports.addproduct = (req, res, next) => {
  // products.push({ title: req.body.title });
  const title = req.body.title;
  const imgURL = req.body.imageurl;
  const price = req.body.price;
  const description = req.body.description;

  // const products = new Product(null,title, imgURL, description, price);
  // products.save().then(()=>{
  //   res.redirect('/');

  // }).catch(err=>{
  //   console.log(err);
  // });
  req.user
    .createProduct({
      title: title,
      price: price,
      imageurl: imgURL,
      description: description,
    })
    .then((result) => {
      console.log("created");

      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });

  // Product.create({
  //   title:title,
  //   price:price,
  //   imageurl:imgURL,
  //   description:description,
  //   userId:req.user.id

  // })
};




exports.getprodetails = (req, res, next) => {
  const proid = req.params.productid;
  Product.findByPk(proid)
  // req.user.getProducts({where : {id:proid}})
  // Product.findAll({where : {id:proid}})
    .then((product) => {
      // console.log(product.title);
      // console.log(products);
      // const product = products[0];

      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/products"
      });
    })
    .catch((err) => {
      console.log(err);
    });
};




exports.postcart = (req, res, next) => {
  const prodId = req.body.productid;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};



exports.getpostproduct = (req, res, next) => {
  // Product.fetchAll().then(
  //   ([rows,fieldData])=>{res.render('shop/product-list', {
  //     prods: rows,
  //     pageTitle: 'Shop',
  //     path: '/',

  //     activeShop: true,
  //     productCSS: true
  //   });}
  // ).catch(err=>{console.log(err)});

  // Product.findAll()
  req.user.getProducts()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};



exports.shopproduts = (req, res, next) => {

  req.user
  .getProducts()
  .then(products => {
    res.render('shop/index', {
      pageTitle: 'shop Product',
      path: '/index',
      prods:products
    
    });
  })
  .catch(err => console.log(err));

  
};




exports.shopcart = (req, res, next) => {
  // console.log(req.user.cart);
  req.user.getCart().then(cart => {
    return cart.getProducts().then(products=>{   
      res.render("shop/cart", {
        path: '/cart',

            pageTitle: "Cart",
            products: products,
          });}).catch(err=>{
      console.log(err);
    });
  }).catch(err=>{
    console.log(err);
  })
  // carts.getcart((cart) => {
  //   product.fatchAll((product) => {
  //     const cartproduct = [];
  //     for (cartprod of product) {
  //       const cartproductdata = cart.products.find(
  //         (prod) => prod.id === cartprod.id
  //       );

  //       if (cartproductdata) {
  //         cartproduct.push({ productdata: cartprod, qty: cartproductdata.qty });
  //       }
  //       console.log(cartproduct);
  //     }
  //     res.render("shop/cart", {
  //       pageTitle: "Cart",
  //       products: cartproduct,
  //     });
  //   });
  // });
};
exports.adminproduct = (req, res, next) => {
  // Product.fetchAll().then(([rows,fieldData])=>{
  //   res.render('admin/products', {
  //     prods: rows,
  //     pageTitle: 'admin-products',
  //     path: '/',
  //     activeShop: true,
  //     productCSS: true
  //   });
  // }).catch(err=>{
  //   console.log(err);
  // })
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "admin-products",
        path: "/admin/products"
      });
    })
    .catch((err) => {
      console.log(err);
    });
};




exports.deletecartitem = (req, res, next) => {
  const prodId = req.body.productid;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};



exports.postorder=(req,res,next)=>{
  let fetchedCart;
req.user.getCart().then(cart=>{
  fetchedCart = cart;
  return cart.getProducts();
})
.then(products=>{
  return req.user.createOrder().then(order=>{
   return order.addProduct(products.map(product=>{
      product.orderItem={quantity:product.cartItem.quantity};
      return product;
    }))
  })
})
.then(result=>{
  return fetchedCart.setProducts(null);
})
.then(result=>{
  res.redirect('/orders');

})
.catch(err=>console.log(err));
}

exports.getOrders=(req,res,next)=>{
 req.user.getOrders({include: ['products']}).then(orders=>{
  res.render('shop/orders',{
    path:'/orders',
    pageTitle:'Your Orders',
    orders:orders
  })
 })
}