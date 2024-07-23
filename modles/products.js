// const { fileLoader } = require('ejs');
// const fs = require('fs');
// const cart = require('./cart');
// const { get } = require('https');
// const path = require('path');
// const db = require('../util/database');
// let products = [];
// const p = path.join(path.dirname(process.mainModule.filename),'data','products.JSON');
// // const getproductfromfile = cb =>{
// //     fs.readFile(p,(err,filecontant)=>{
// //         if(err){
// //           cb([]);
// //         }
// //          cb(JSON.parse(filecontant));
// //     });
// // }

// module.exports = class product{
//     constructor(id,title,imgURL,description,price){
//         this.id = id;
//         this.title =title;
//         this.imgURL = imgURL;
//         this.description = description;
//         this.price = price;

//     }
//     // save(){
//     //    getproductfromfile(products=>{
//     //     if(this.id){
//     //         const existingproductindex = products.findIndex(proid => proid.id === this.id);

//     //         const updatedproduct = [...products];
//     //         updatedproduct[existingproductindex] = this;
//     //         fs.writeFile(p,JSON.stringify(updatedproduct),(err)=>{
//     //             console.log(err);
//     //         });
//     //     }
//     //     else{ this.id = this.id = Math.floor(Math.random() * 1000000).toString();
//     //         products.push(this);
//     //         fs.writeFile(p,JSON.stringify(products),(err)=>{
//     //             console.log(err);
//     //         });}
//     //    })
//     // }

// //     static fatchAll(cb){
// //         // return products;
// //        getproductfromfile(cb);

// //     }
// // static findbyid(id,cb){
// //     getproductfromfile(products =>{
// //         const product = products.find(p=>p.id === id);
// //         cb(product);
// //     });

// // }
// // static delete(id){
// //     getproductfromfile(products=>{
// //         const product = products.find(prod => prod.id === id);
// //         if (!product) {
// //             console.log(`Product with id ${id} not found.`);
// //             return;
// //         }
// //         const productindex = products.filter(proid => proid.id !== id);
// //         fs.writeFile(p, JSON.stringify(productindex), (err) => {
// //             if (!err ) {
// //                 cart.deleteproduct(id, product.price);
// //             }
// //         });

// //     })
// // };
// save(){
//    return db.execute('INSERT INTO products (title,price,description,imageurl) VALUES (?,?,?,?)',
//         [this.title,this.price,this.description,this.imgURL]);

// }

// static fetchAll(){
// return db.execute('SELECT * FROM products');
// }

// static findbyid(id){
//  return    db.execute('SELECT * FROM products WHERE products.id =?',[id]);
// }

// static delete(id){
//     return db.execute('DELETE FROM products WHERE products.id = ?',[id]);
// }

// }

// const Sequelize = require('sequelize');
// const sequelize =require('../util/database');

// const Products =   sequelize.define('products',{
//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true

//     },
//     title:{
//         type :Sequelize.STRING
//     },
//     price:{
//         type:Sequelize.DOUBLE,
//         allowNull:false
//     },
//     imageurl:{
//         type:Sequelize.STRING,
//         allowNull:false
//     },
//     description:{
//         type:Sequelize.STRING,
//         allowNull:false
//     }
// });
// module.exports =Products;

const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
class Product {
  constructor(title, price, description, imageUrl, id,userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp

      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();

    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(proid) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(proid) })
      .next()
      .then((product) => {
        // console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(proid) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(proid) });
  }
}

module.exports = Product;
