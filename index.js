require('dotenv').config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverRide = require('method-override');
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const {isRouteActive} = require("./server/helpers/routeHelper");

const connectDB = require("./server/config/db"); 
const session = require('express-session');


const app = express();
const PORT = 5000 || process.env.PORT;

// connect to db
connectDB();

app.use(express.urlencoded({extended:true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverRide('_method'));

app.use(session({
    secret : 'Anas Youssef',
    resave : false,
    saveUninitialized : true,
    store : MongoStore.create({
        mongoUrl:process.env.MONGODB_URI
    })
}))

app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout' , './layouts/main');
app.set('view engine' , 'ejs');


app.locals.isRouteActive = isRouteActive;


app.use('/' , require('./server/routes/main'));
app.use('/' , require('./server/routes/admin'));

app.listen(PORT , ()=> {
    console.log('App listening on ' , PORT);
})