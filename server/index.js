const express = require("express");
const app = express();
const dotenv = require("dotenv")
const products = require("./data/Products")
dotenv.config()
const cors = require('cors');
const PORT = process.env.PORT

const mongoose = require("mongoose")

mongoose.connect(process.env.MONGOOSE_DB).then(() => {
    console.log("DB Connected")
}).then((err) => {
    err;
})

const databaseSeeder = require("./databaseSeeder")
const userRoute = require("./routes/User")
const productRoute = require("./routes/Product")
const orderRoute = require("./routes/Order")

app.use(cors());
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
    try {
        // Check database connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not connected');
        }
        res.json({ status: 'ok', message: 'Server is healthy' });
    } catch (error) {
        res.status(503).json({ 
            status: 'error', 
            message: 'Server is not healthy',
            error: error.message 
        });
    }
});

//database sender routes
app.use('/api/seed', databaseSeeder)

//routes for user111
//api/users/login   
app.use('/api/users', userRoute)

//routes for products
app.use("/api/products", productRoute)

//route for orders
app.use("/api/orders", orderRoute)

//username: jimroep
//password: gnPSESqm32Uei9r2
//mongodb+srv://jimroep:gnPSESqm32Uei9r2@cluster0.mqpchb2.mongodb.net/SE-EComm-App

app.listen(PORT || 3000, () => {
    console.log(`Server listening on port ${PORT}`);
});
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// app.get("/api/products/:id", (req, res) => {
//     const product = products.find((product) => product.id == req.params.id)
//     res.json(product)
// })