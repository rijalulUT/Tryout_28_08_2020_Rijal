module.exports = (squelize,Squelize) => {
    const Product = squelize.define("products",{
        name: {
            type: Squelize.STRING
        },
        stock: {
            type: Squelize.INTEGER
        },
        price: {
            type: Squelize.INTEGER
        },
    })
    return Product;
}