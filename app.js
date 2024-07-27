const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv')
const ejsLayouts = require('express-ejs-layouts');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin')
const connectDB = require('./config/db')

// Load environment variables from .env file
dotenv.config()


// Connect to database
connectDB();

// Set view engine
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

app.use(ejsLayouts)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Load routes
app.use('/', userRouter);
app.use('/admin',adminRouter)



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});