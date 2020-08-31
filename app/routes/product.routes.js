module.exports = app => {
    const products = require("../controllers/product.controller")
    const auth = require("../middleware/auth")
    let router = require("express").Router()

    //create new post
    router.post("/",products.createProduct)
    router.get("/:product_id",products.getProductById)
    router.get("/all/:limit/:pagination",products.getProductAll)
    router.put("/:id",products.editProduct)
    //router.delete("/:id",products.deleteProduct)
    app.use("/api/v1/products/",auth.isAuth,router)
}