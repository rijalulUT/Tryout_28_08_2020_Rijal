const dbConfig = require("../config/db.config")
const Sequelize= require("sequelize")

const sequelize =
new  Sequelize(
        dbConfig.DB,
        dbConfig.USER,
        dbConfig.PASSWORD,{
            host: dbConfig.HOST,
            dialect: dbConfig.dialect,
            operatorAliases: false,
            pool : {
                max: dbConfig.pool.max,
                min: dbConfig.pool.min,
                acquire: dbConfig.pool.min,
                idle:dbConfig.pool.min
            }
        }
    )

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

// create table
db.users = require("./user.model")(sequelize,Sequelize)

//relation tabel User - Order
// db.users.hasMany(db.order);

// db.order.belongsTo(db.users, { 
//     foreignKey: "userId"
// });

module.exports = db