module.exports = (squelize,Squelize) => {
    const User = squelize.define("users",{
        full_name: {
            type: Squelize.STRING
        },
        username: {
            type: Squelize.STRING,
            unique: true
        },
        email: {
            type: Squelize.STRING,
            unique: true
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