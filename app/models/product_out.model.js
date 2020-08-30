module.exports = (squelize,Squelize) => {
    const ProductOut = squelize.define("product_out",{
        date: {
            type: Squelize.DATE
        },
        total: {
            type: Squelize.INTEGER
        },
    })
    return ProductOut;
}