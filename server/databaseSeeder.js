const router = require("express").Router();
const User = require("./models/User")
const users = require("./data/Users")
const Product = require("./models/Product")
const products = require("./data/Products")
const Order = require("./models/Order")
const AsyncHandler = require("express-async-handler")

// Seed users
router.post('/users', AsyncHandler(
    async(req, res) => {
        try {
            await User.deleteMany({})
            const UserSeeder = await User.insertMany(users)
            res.json({ success: true, data: UserSeeder })
        } catch (error) {
            console.error('Error seeding users:', error)
            res.status(500).json({ 
                success: false, 
                error: error.message 
            })
        }
    }
))

// Seed products
router.post('/products', AsyncHandler(
    async(req, res) => {
        try {
            await Product.deleteMany({})
            
            // Convert string IDs to ObjectIds if needed
            const formattedProducts = products.map(product => ({
                ...product,
                _id: product._id // Already converted to string in Products.js
            }))

            const ProductSeeder = await Product.insertMany(formattedProducts)
            console.log('Products seeded successfully:', ProductSeeder.length)
            res.json({ 
                success: true, 
                count: ProductSeeder.length,
                data: ProductSeeder
            })
        } catch (error) {
            console.error('Error seeding products:', error)
            res.status(500).json({ 
                success: false, 
                error: error.message 
            })
        }
    }
))

// Seed all data
router.post('/', AsyncHandler(
    async(req, res) => {
        try {
            // Clear existing data
            await User.deleteMany({})
            await Product.deleteMany({})

            // Seed users
            const seededUsers = await User.insertMany(users)

            // Seed products
            const formattedProducts = products.map(product => ({
                ...product,
                _id: product._id // Already converted to string in Products.js
            }))
            const seededProducts = await Product.insertMany(formattedProducts)

            res.json({
                success: true,
                users: seededUsers.length,
                products: seededProducts.length
            })
        } catch (error) {
            console.error('Error seeding database:', error)
            res.status(500).json({ 
                success: false, 
                error: error.message 
            })
        }
    }
))

// Update all orders to use COD payment method
router.post('/update-payment-method', AsyncHandler(
    async(req, res) => {
        try {
            const result = await Order.updateAllPaymentMethods();
            
            res.json({ 
                success: true, 
                message: 'Updated payment method for all orders',
                modifiedCount: result.modifiedCount
            });
        } catch (error) {
            console.error('Error updating payment methods:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }
));

module.exports = router;