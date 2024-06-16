const path = require('path');
const errorcontroller =  require('./controller/error');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/database');
const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
db.execute('SELECT * FROM products').then(result =>{
    console.log(result[0]);
}).catch(err=>{
    console.log(err);
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use(errorcontroller.get404error);

app.listen(3000);
