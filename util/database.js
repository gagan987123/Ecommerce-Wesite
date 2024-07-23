// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database: 'ecommerse',
//     password:'0020033'

// });
// module.exports = pool.promise();

// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('ecommerse','root','0020033',{dialect: 'mysql',host:'localhost'});
// module.exports = sequelize;

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;


const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://gagandeep:Arora09++@cluster0.v1udusr.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  ) .then((client) => {
    console.log("Connected to MongoDB");
    _db = client.db();
    callback(); 
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    throw err;
  });
   
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database instance found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
