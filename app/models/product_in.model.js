module.exports = (squelize,Squelize) => {
    const ProductIn = squelize.define("product_in",{
        date: {
            type: Squelize.DATE
        },
        total: {
            type: Squelize.INTEGER
        },
    })
    return ProductIn;
}