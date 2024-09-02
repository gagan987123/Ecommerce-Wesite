const path = require("path");
const errorcontroller = require("./controller/error");
const express = require("express");
const bodyParser = require("body-parser");
const User = require("./modles/user");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
// const sequelize = require("./util/database");
// const Product = require("./modles/products");
// const Cart = require('./modles/cart');
// const CartItem = require('./modles/cart-item')
// const Order = require('./modles/order');
// const OrderItem = require('./modles/order-item');
// const mongoConnect  = require('./util/database').mongoConnect;
const MOnGODB_URI = 'mongodb+srv://gagandeep:Arora09++@cluster0.v1udusr.mongodb.net/shopping?retryWrites=true&w=majority&appName=Cluster0';
const app = express();
const store = new MongoDBStore({
    uri: MOnGODB_URI,
    collection: 'sessions'
})

const csrfProtection = csrf();




//setting enjine and views dir
app.set("view engine", "ejs");
app.set("views", "views");


//sattic file public dir
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

//routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
// db.execute('SELECT * FROM products').then(([rows,field]) =>{
//     console.log(rows);
//     console.log(field);
// }).catch(err=>{
//     console.log(err);
// })




// //storing default user in req
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log(err);
        });
});




//routing
app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

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





mongoose.connect(MOnGODB_URI).then(() => {
    // User.findOne().then(user => {
    //     if (!user) {
    //         const user = new User({
    //             name: 'gagan',
    //             email: 'gagan@gmail.com',
    //             cart: {
    //                 items: []
    //             }
    //         });
    //         user.save();

    //     }
    // })
    app.listen(3000);
    console.log('connected');
}).catch((err) => {
    console.log(err);
});