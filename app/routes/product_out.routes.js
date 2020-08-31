module.exports = app => {
    const product_out = require("../controllers/product_out.controller")
    const auth = require("../middleware/auth")
    let router = require("express").Router()

    //create new post
    router.post("/",product_out.createProduct)
    router.get("/:in_id",product_out.getProductById)
    router.get("/all/:limit/:pagination",product_out.getProductAll)
    app.use("/api/v1/product_out/",auth.isAuth,router)
}