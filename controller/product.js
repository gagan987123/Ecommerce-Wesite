const product = require('../modles/products');
const Product = require('../modles/products');
const carts  = require('../modles/cart');

exports.getproduct = (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    });
  };

  exports.geteditproduct = (req, res, next) => {
    const editmode = req.query.edit;
    if(!editmode){
      return res.redirect('/');
    }
    const proid = req.params.productid ;
    product.findbyid(proid,product=>{
      if(!product){
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/edit-product',
        editing: editmode,
        product:product
      });
    })
   
  };
  exports.deleteproduct =(req,res,next)=>{
    const productid = req.body.productid;
    console.log(productid);
    product.delete(productid);
    res.redirect('/admin/product');
  }
exports.posteditproduct = (req,res,next)=>{
const productid = req.body.productid;
const updatedtitle = req.body.title;
const updatedprice = req.body.price;
const updatedImageurl = req.body.imgURL;
const updateddesc = req.body.description;

const updatedProduct = new product(productid,updatedtitle,updatedImageurl,updateddesc,updatedprice);
updatedProduct.save();
res.redirect('/admin/product');



};
  exports.addproduct =  (req, res, next) => {
    // products.push({ title: req.body.title });
    const title = req.body.title;
    const imgURL = req.body.imgURL;
    const price = req.body.price;
    const description = req.body.description;
 
    const products = new Product(null,title, imgURL, description, price);
    products.save();
    res.redirect('/');
  };


exports.getprodetails = (req,res,next)=>{
  const proid = req.params.productid;
product.findbyid(proid,product =>{
  res.render('shop/product-details',{product:product ,pageTitle: product.title} )
});
  
}
exports.postcart = (req,res,next)=>{
  const proid = req.body.productid;
  product.findbyid(proid,(product)=>{
    carts.addmodule(proid,product.price);
  })
   

  res.redirect('/cart');

}

 exports.getpostproduct= (req, res, next) => {
Product.fatchAll((products)=>{
  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true
  });
});
   
  }

exports.shopproduts = (req,res,next)=>{
  res.render('shop/index',{
    pageTitle: 'Shopping',

  });
}

exports.shopcart = (req,res,next)=>{
  carts.getcart(cart=>{
    product.fatchAll(product => {
      const cartproduct =[];
      for( cartprod of product){
        const cartproductdata=cart.products.find(prod =>prod.id === cartprod.id);
      
        if(cartproductdata){
          cartproduct.push({productdata: cartprod,qty:cartproductdata.qty });
        }
        console.log(cartproduct);
      }
      res.render('shop/cart',{
        pageTitle: 'Cart',
        products:cartproduct
      });
    })
  })
 
}
exports.adminproduct = (req,res,next)=>{
  Product.fatchAll((products)=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'admin-products',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
}
exports.deletecartitem=(req,res,next)=>{
  const prodid = req.body.productid;
  product.findbyid(prodid,product =>{
    carts.deleteproduct(prodid,product.price);
    res.redirect('/cart');
  })
}