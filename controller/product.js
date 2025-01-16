// const product = require("../modles/products");
const Product = require("../modles/products");
const carts = require("../modles/cart");
const Order = require("../modles/order");
const fs = require("fs");
const Path = require("path");
const fileHelper = require("../util/file");
const PDFDocument = require("pdfkit");
// const { where } = require("sequelize");
const { products } = require("../routes/admin");
const CartItem = require("../modles/cart-item");
const path = require("../util/path");
const mysql = require("../util/database"); // Use mysql2 library for promises
const XLSX = require("xlsx");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const { ReturnDocument } = require("mongodb");

const stripe = require("stripe")(
  "sk_test_51PwjnCRptKovWDKiJUkboRrdgkMJUeHKmTg3LWwXNADMSaXvye0Oo19m2MZ2XtyIbWBJysFK9M8cdswTQG0DpNf200Qk1tTUle"
);
// const { ObjectId } = require("mongodb");
const ITEM_PER_PAGE = 4;
const ITEM_PER_PAGE2 = 4;

exports.getproduct = (req, res, next) => {
  // req.user
  //   .getProducts()
  //   .then((products) => {

  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
  // })
  // .catch((err) => console.log(err));
};

exports.deleteproduct = (req, res, next) => {
  const productid = req.params.productid;
  Product.findById(productid)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found."));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: productid, userId: req.user._id });
    })
    .then(() => {
      console.log("destroyed product");
      res.status(200).json({ message: "sccess" });
    })
    .catch((err) => {
      // res.redirect("/500");

      //   const error = new Error(err);
      //   error.httpStatusCode = 500;
      //   return next(error);

      res.status(500).json({ message: "deleting failed" });
    });
};

exports.geteditproduct = (req, res, next) => {
  const editmode = req.query.edit;
  if (!editmode) {
    return res.redirect("/");
  }
  const proid = req.params.productid;
  // product.findByPk(proid)
  Product.findById(proid)
    .then((products) => {
      if (!products) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: editmode,
        product: products,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.posteditproduct = (req, res, next) => {
  const productid = req.body.productid;
  const updatedtitle = req.body.title;
  const updatedprice = req.body.price;
  const image = req.file;
  const updateddesc = req.body.description;

  // const product = new Product({
  //   title:updatedtitle,
  //   price:updatedprice,
  //   description:updateddesc,
  //   imageUrl:updatedImageurl });
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedtitle,

        price: updatedprice,
        description: updateddesc,
        _id: productid,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  Product.findById(productid)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedtitle;
      product.price = updatedprice;
      product.description = updateddesc;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save();
    })
    // product
    //   .findByPk(productid)
    //   .then((product) => {
    //     if (!product) {
    //       // Handle the case where product is not found
    //       return res.status(404).send("Product not found");
    //     }
    //     product.title = updatedtitle;
    //     product.price = updatedprice;
    //     product.imageurl = updatedImageurl;
    //     product.description = updateddesc;
    //     return product.save();
    //   })
    .then((result) => {
      console.log("updated");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.addproduct = (req, res, next) => {
  // products.push({ title: req.body.title });
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,

        price: price,
        description: description,
      },
      errorMessage: "Added file is not a image",
      validationErrors: [],
    });
  }
  // const products = new Product(null,title, imgURL, description, price);
  // products.save().then(()=>{
  //   res.redirect('/');

  // }).catch(err=>{
  //   console.log(err);
  // });

  // Product.create({
  //   title:title,
  //   price:price,
  //   imageurl:imgURL,
  //   description:description,
  //   userId:req.user.id

  // })

  // req.user
  //   .createProduct({
  //     title: title,
  //     price: price,
  //     imageurl: imgURL,
  //     description: description,
  //   })
  //   .then((result) => {
  //     console.log("created");

  //     res.redirect("/admin/products");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // const product = new Product(title, price, description, imgURL,null , req.user._id );

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,

        price: price,
        description: description,
      },
      errorMessage: error.array()[0].msg,
      validationErrors: error.array(),
    });
  }
  const imgURL = image.path;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imgURL,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      console.log("created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getprodetails = (req, res, next) => {
  const proid = req.params.productid;
  Product.findById(proid)
    // req.user.getProducts({where : {id:proid}})
    // Product.findAll({where : {id:proid}})
    .then((product) => {
      // console.log(product.title);
      // console.log(products);
      // const product = products[0];

      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postcart = (req, res, next) => {
  const prodId = req.body.productid;

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      // console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(prodId);
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
};

exports.getpostproduct = (req, res, next) => {
  const page = +req.query.page || 1;

  let totalItems;
  Product.find()
    .countDocuments()
    .then((numProduct) => {
      totalItems = numProduct;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })

    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
      });
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // Product.findAll()
  // req.user
  //   .getProducts()
  //   .then((products) => {
  //     res.render("shop/product-list", {
  //       prods: products,
  //       pageTitle: "shop",
  //       path: "/",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.shopproduts = (req, res, next) => {
  const page = +req.query.page || 1;

  let totalItems;
  Product.find()
    .countDocuments()
    .then((numProduct) => {
      totalItems = numProduct;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE2)
        .limit(ITEM_PER_PAGE2);
    })

    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEM_PER_PAGE2 * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE2),
      });
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.shopcart = (req, res, next) => {
  // console.log(req.user.cart);
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "admin-products",
        path: "/",
        activeShop: true,
        productCSS: true,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // req.user
  //   .getProducts()
  //   .then((products) => {
  //     res.render("admin/products", {
  //       prods: products,
  //       pageTitle: "admin-products",
  //       path: "/admin/products",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.deletecartitem = (req, res, next) => {
  const prodId = req.body.productid;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postorder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      console.log(req.user);
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order Found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = Path.join("data", "invoice", invoiceName);
      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("-----------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x " +
              "$" +
              prod.product.price
          );
      });
      pdfDoc.text("---");
      pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);

      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //     if (err) {
      //         return next(err);
      //     }
      //     res.setHeader("Content-Type", "application/pdf");
      //     res.setHeader(
      //         "Content-Disposition",
      //         'inline; filename="' + invoiceName + '"'
      //     );
      //     res.send(data);
      // });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;

  req.user
    .populate("cart.items.productId")
    .then((user) => {
      products = user.cart.items;
      total = 0;
      products.forEach((p) => {
        total += p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((p) => {
          return {
            quantity: p.quantity, // Ensuring correct quantity
            price_data: {
              currency: "INR",
              unit_amount: p.productId.price * 100, // Stripe expects the price in the smallest currency unit (e.g., paise for INR)
              product_data: {
                name: p.productId.title,
                description: p.productId.description,
              },
            },
          };
        }),
        mode: "payment",
        success_url:
          req.protocol + "://" + req.get("host") + "/checkout/success",
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancle",
      });
    })
    .then((session) => {
      res.render("shop/checkouting", {
        path: "/shop/checkout",
        pageTitle: "checkout",
        products: products,
        totalSum: total,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
