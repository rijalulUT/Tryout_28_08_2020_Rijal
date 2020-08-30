module.exports = (squelize,Squelize) => {
    const Product = squelize.define("products",{
        full_name: {
            type: Squelize.STRING
        },
        username: {
            type: Squelize.STRING
        },
        email: {
            type: Squelize.STRING
        },
        phone_number: {
            type: Squelize.STRING
        },
        salt: {
            type: Squelize.STRING
        },
        password: {
            type: Squelize.STRING
        },
        role: {
            type: Squelize.STRING
        },
    })
    return User;
}