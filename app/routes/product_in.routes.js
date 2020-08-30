module.exports = app => {
    const product_in = require("../controllers/product_in.controller")
    const auth = require("../middleware/auth")
    let router = require("express").Router()

    //create new post
    router.post("/",product_in.createProduct)
    router.get("/:in_id",product_in.getProductById)
    router.get("/all/:limit/:pagination",product_in.getProductAll)
    app.use("/api/v1/product_in/",auth.isAuth,router)
}