const mongoose = require('mongoose');

const products = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Spicy Chicken Wings",
    image: "/wings.jpg",
    description: "Delicious spicy chicken wings, glazed to perfection.",
    rating: 4,
    numReview: 25,
    price: 12,
    countInStock: 10
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Half Pound Burger",
    image: "/burgerpic.jpg",
    description: "Juicy beef patty with cheddar cheese and saucy mayo .",
    rating: 5,
    numReview: 40,
    price: 15,
    countInStock: 8
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Veggie Salad Bowl",
    image: "/salad.jpg",
    description: "A healthy mix of greens, avocado, and quinoa.",
    rating: 4,
    numReview: 18,
    price: 10,
    countInStock: 12
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Pepperoni Pizza",
    image: "/pizza.jpg",
    description: "It is baked flatbread with toppings.",
    rating: 4,
    numReview: 18,
    price: 10,
    countInStock: 12
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: "Chocolate Cookie Frappe",
    image: "/chocofrappe.jpg",
    description: "A creamy blend of chocolate and crushed cookies.",
    rating: 4,
    numReview: 18,
    price: 10,
    countInStock: 12
  }
];

module.exports = products;
