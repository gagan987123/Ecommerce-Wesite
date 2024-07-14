const path = require("path");
const errorcontroller = require("./controller/error");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const Product = require("./modles/products");
const User = require("./modles/user");
const Cart = require('./modles/cart');
const CartItem = require('./modles/cart-item')
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// db.execute('SELECT * FROM products').then(([rows,field]) =>{
//     console.log(rows);
//     console.log(field);
// }).catch(err=>{
//     console.log(err);
// })
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminData.routes);
app.use(shopRoutes);
app.use(errorcontroller.get404error);



Product.belongsTo(User,{ constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});




sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "gagan", email: "gagan@gemail.com" });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    return user.createCart();
  return user.createCart();
  }).then(cart=>{
    
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
