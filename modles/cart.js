// const { fileLoader } = require('ejs');
// const fs = require('fs');
// const path = require('path');
// const { unzipSync } = require('zlib');
// const product = require('./products');
// const p = path.join(path.dirname(process.mainModule.filename),'data','cart.json');

// module.exports= class cart{
// static addmodule(id,productprice){
//     fs.readFile(p,(err,filecontent)=>{
//         let cart = {products:[] ,totalprice:0};
//         if(!err){
            
//                 cart = JSON.parse(filecontent);
            
//         }
//         const existingproductindex = cart.products.findIndex(prod =>prod.id === id);
//         const existingproduct = cart.products[existingproductindex];

//         let updatedproduct;

//         if(existingproduct){
//             updatedproduct = { ...existingproduct };
//             updatedproduct.qty  = updatedproduct.qty +1;
//             cart.products =[...cart.products];
//             cart.products[existingproductindex] = updatedproduct

//         }else{
//             updatedproduct = {id:id, qty:1};
//             cart.products = [...cart.products,updatedproduct];
//         }
//         cart.totalprice = cart.totalprice + +productprice;
//         fs.writeFile(p,JSON.stringify(cart), err =>{
//             console.log(err);
//         })
//     })

// } 

// static deleteproduct(id,productprice){
//     fs.readFile(p,(err,filecontent)=>{
//         if(err){
//             return;
//         }
//         const updatedcart = { ...JSON.parse(filecontent) };
//         const productindex = updatedcart.products.find(prod => prod.id === id);
//         if (!productindex) {
//             return;
//         }
//         const productqty  =productindex.qty;
     
//         updatedcart.products = updatedcart.products.filter(prod => prod.id !== id);
// updatedcart.totalprice = updatedcart.totalprice - productprice * productqty;
//         fs.writeFile(p,JSON.stringify(updatedcart),err=>{
//             console.log(err);
//         })
//     })
// }

// static getcart(cb){
// fs.readFile(p,(err,filecontent)=>{
    
//     const cart = JSON.parse(filecontent);
//     if(err){
//         console.log(err);
//        cb(null);
//     }
//     else{
//     cb(cart);}
// })
// };
// }



// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Cart  = sequelize.define('cart',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     }
// })
// module.exports = Cart;
