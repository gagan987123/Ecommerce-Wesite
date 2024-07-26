const path = require("path");
const errorcontroller = require("./controller/error");
const express = require("express");
const bodyParser = require("body-parser");
const User = require("./modles/user");
const mongoose = require('mongoose');
// const sequelize = require("./util/database");
// const Product = require("./modles/products");
// const Cart = require('./modles/cart');
// const CartItem = require('./modles/cart-item')
// const Order = require('./modles/order');
// const OrderItem = require('./modles/order-item');
// const mongoConnect  = require('./util/database').mongoConnect;

const app = express();

//routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");


//setting enjine and views dir
app.set("view engine", "ejs");
app.set("views", "views");


//sattic file public dir
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));



// db.execute('SELECT * FROM products').then(([rows,field]) =>{
//     console.log(rows);
//     console.log(field);
// }).catch(err=>{
//     console.log(err);
// })




//storing default user in req
app.use((req, res, next) => {
  User.findById('66a335770a29e47883ed25aa')
    .then((user) => {
      req.user = user ;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});




//routing
app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);
app.use(errorcontroller.get404error);



// Product.belongsTo(User,{ constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product,{through:CartItem});
// Product.belongsToMany(Cart,{through:CartItem});
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product,{through:OrderItem});



// sequelize
//   .sync()
//   .then((result) => {
//     return User.findByPk(1);
//     // console.log(result);
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({ name: "gagan", email: "gagan@gemail.com" });
//     }
//     return user;
//   })
//   .then((user) => {
//     // console.log(user);
//     return user.createCart();
//   return user.createCart();
//   }).then(cart=>{
    
//     app.listen(3000);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// mongoConnect(()=>{
//   app.listen(3000);
// })





mongoose.connect('mongodb+srv://gagandeep:Arora09++@cluster0.v1udusr.mongodb.net/shopping?retryWrites=true&w=majority&appName=Cluster0').then(() => {
User.findOne().then(user=>{
  if(!user){
    const user = new User({
    name:'gagan',
    email:'gagan@gmail.com',
    cart:{
      items:[]
    }
   });
   user.save();

  }
})
  app.listen(3000);
  console.log('connected');
}).catch((err) => {
  console.log(err);
});