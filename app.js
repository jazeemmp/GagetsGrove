const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv')
const ejsLayouts = require('express-ejs-layouts');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin')
const connectDB = require('./config/db')
const session = require('express-session')
const MongoStore = require('connect-mongo');

// Load environment variables from .env file
dotenv.config()

// Connect to database
connectDB();
// Set view engine
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
// Using Session
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:6000000}
}))
//mongo
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
  }));
//Basic  middlewares
app.use(ejsLayouts)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Load routes
app.use('/', userRouter);
app.use('/admin',adminRouter)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});