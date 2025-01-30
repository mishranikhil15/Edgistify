const express=require("express")


const {connection}=require("./config/db")
const cors=require("cors")
const{userrouter}=require("./routes/userroute")


const{authenticate}=require("./middlewares/authentication")
const { userRouter } = require("./routes/userroute")
const { cartRouter } = require("./routes/cartroute")
const { orderRouter } = require("./routes/orderroute")
const { productRouter } = require("./routes/productroute")
const productmodel = require("./model/productmodel")

require("dotenv").config()

const app=express();

app.use(cors({
    origin:"*"
}))

app.use(express.json())


app.get("/",(req,res)=>{
    res.send("welcome")
})

app.use("/api/users", userRouter); 
app.use("/api/products", productRouter); 
app.use("/api/cart", cartRouter); 
app.use("/api/orders", orderRouter); 

// const products = [
//     {
//       name: "Wireless Mouse",
//       price: 25.99,
//       stock: 100,
//       image: "https://via.placeholder.com/150?text=Wireless+Mouse"
//     },
//     {
//       name: "Mechanical Keyboard",
//       price: 79.99,
//       stock: 50,
//       image: "https://via.placeholder.com/150?text=Mechanical+Keyboard"
//     },
//     {
//       name: "Bluetooth Headphones",
//       price: 59.99,
//       stock: 150,
//       image: "https://via.placeholder.com/150?text=Bluetooth+Headphones"
//     },
//     {
//       name: "USB-C Cable",
//       price: 9.99,
//       stock: 200,
//       image: "https://via.placeholder.com/150?text=USB-C+Cable"
//     },
//     {
//       name: "Laptop Stand",
//       price: 39.99,
//       stock: 75,
//       image: "https://via.placeholder.com/150?text=Laptop+Stand"
//     }
//   ];

  
//   const createDummyProducts = async () => {
//     try {
//       // Remove any existing products to avoid duplication
//       await productmodel.deleteMany({});
  
//       // Insert dummy products
//       await productmodel.insertMany(products);
  
//       console.log("Dummy products with images created successfully!");
//     } catch (error) {
//       console.error("Error creating dummy products:", error);
//     }
//   };

//   createDummyProducts()

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("connected to db")
    } catch (error) {
        console.log(error)
        console.log("Trouble while connecting to db")
    }
    console.log(`running at ${process.env.port}`)
})