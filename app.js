const path = require("path");
const https = require("https");
const fs = require("fs");
const errorcontroller = require("./controller/error");
const express = require("express");
const bodyParser = require("body-parser");
const User = require("./modles/user");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const helmet = require("helmet");
const multer = require("multer");
const compression = require("compression");
const morgan = require("morgan");
// const sequelize = require("./util/database");
// const Product = require("./modles/products");
// const Cart = require('./modles/cart');
// const CartItem = require('./modles/cart-item')
// const Order = require('./modles/order');
// const OrderItem = require('./modles/order-item');
// const mongoConnect  = require('./util/database').mongoConnect;

// mongo db uri or url  to connect the db
const MOnGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.v1udusr.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;

//intilizing the server
const app = express();

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );
// app.use(helmet());
// app.use(compression());
// app.use(morgan("combined", { stream: accessLogStream }));

const store = new MongoDBStore({
  uri: MOnGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

// const privateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + "-" + file.originalname);
//   },
// });

//setting enjine and views dir
app.set("view engine", "ejs");
app.set("views", "views");

//routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

//paring the incoming req body if url (urlencoded,extented = false (not use obj struct use key value pair))
//like name=John&age=30, this will be parsed and accessible as req.body.name = "John" and req.body.age = "30".
app.use(bodyParser.urlencoded({ extended: false }));

const fileStorage = multer.diskStorage({
  destination: "images", // images folder
  filename: function (req, file, cb) {
    return cb(null, file.originalname); // file name to be stored eg new Date() +file.originalname
  },
});

//type of file to be stored
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//using multer middleware to store files like images filestorege is location ans filefilter is type of file will store
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

//sattic file public dir
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "my secret", // Used to sign the session ID cookie
    resave: false, // Prevents saving session if it hasn't been modified
    saveUninitialized: false, // Prevents creating sessions for unauthenticated users
    store: store, // Stores session data in MongoDB (or other stores)
  })
);

//CSRF (Cross-Site Request Forgery) protection
// CSRF Token Generation: When a user accesses a page with a form, the CSRF middleware generates a unique token and stores it in the user's session.
// Embedding Token in Forms: You embed this token in your HTML forms (or include it in AJAX requests) so that it gets sent along with the form data to the server.
// Token Verification: When a form is submitted, the server checks if the token included in the request matches the token stored in the session. If the tokens don't match, the request is rejected.
app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken(); // Any property set on res.locals will be accessible in the view templates.
  next();
});

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
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

//routing
app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);
app.get("/500", errorcontroller.get500error);
app.use(errorcontroller.get404error);

app.use((error, req, res, next) => {
  // res.redirect("/500");
  res.status(500).render("500", {
    error: error,
    pageTitle: "Error ",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

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

//mogoonse connect to mongodb .connect returens a promises
mongoose
  .connect(MOnGODB_URI)
  .then(() => {
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    app.listen(process.env.PORT || 3000);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
