module.exports = (squelize,Squelize) => {
    const User = squelize.define("users",{
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