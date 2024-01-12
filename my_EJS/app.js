const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const port = 3000;

app.use(session({
    secret: '60000', // กำหนดค่า secret key ให้เป็นค่าที่ปลอดภัย
    resave: true,
    saveUninitialized: true
  }));


app.use(flash());

app.set('views',__dirname + '/views')
app.set('view engine','ejs');
app.engine('ejs',ejs.renderFile);

app.use('/static', express.static(path.join(__dirname, 'views')));


require('dotenv').config();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

let root_path = path.resolve(__dirname,'');
app.use(express.static(root_path));

const indexRoutes = require('../my_EJS/router/index');
const locationRoutes = require('../my_EJS/router/location');
const loginRoutes = require('../my_EJS/router/login');
const userRoutes = require('../my_EJS/router/user');
//const manufactureRoutes = require('../ex2_router/router/manufacture');
//use
app.use('/index',indexRoutes);
app.use('/location',locationRoutes);
app.use('/login',loginRoutes);
app.use('/user',userRoutes);
//app.use("/manufacture",manufactureRoutes);


app.listen(3000,'localhost',()=> {
    console.log('runnnnnnnnnnnnnn')
})