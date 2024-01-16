//app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const flash = require('connect-flash');
const sessionConfig = require('../my_EJS/middleware/session-config')

const app = express();
const port = 3000;


app.use(sessionConfig);


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
const adminRoutes = require('./router/admin');
const loginRoutes = require('../my_EJS/router/login');
const homeRoutes = require('../my_EJS/router/home');
const registerRoutes = require('../my_EJS/router/register');
const logoutRoutes = require('../my_EJS/router/logout');

const employerRoutes = require('../my_EJS/models/employer');
const employeeRoutes = require('../my_EJS/models/employee');

//middleware
const checkAuth  = require('../my_EJS/middleware/checkAuth');
const checkEmployer  = require('../my_EJS/middleware/Check_Employer');
const checkEnployee  = require('../my_EJS/middleware/Check_Emplyee');



//use

app.use('/index',indexRoutes);
app.use('/admin',checkAuth,adminRoutes);
app.use('/home',homeRoutes);
app.use('/login',loginRoutes);
app.use('/register',registerRoutes);
app.use('/logout',logoutRoutes);
app.use('/employer',checkAuth,checkEmployer,checkEnployee,employerRoutes);
app.use('/employee',checkAuth,checkEmployer,checkEnployee,employeeRoutes);

///////////////log///////////////

app.use((req, res, next) => {
  if (req.session) {
      console.log('Session is set:', req.session);
  } else {
      console.log('Session is not set');
  }
  next();
});

app.use((req, res, next) => {
  if (req.session && req.session.isLoggedIn) {
      console.log('User is logged in:', req.session.user);
  } else {
      console.log('User is not [ADMIN] logged in');
  }
  next();
});

app.get('/example-route', (req, res) => {
  if (req.session && req.session.isLoggedIn) {
      console.log('User is logged in:', req.session.user);
  } else {
      console.log('User is not [ADMIN] logged in');
  }
  res.send('Example route');
});



app.listen(3000,'localhost',()=> {
    console.log('runnnnnnnnnnnnn')
})