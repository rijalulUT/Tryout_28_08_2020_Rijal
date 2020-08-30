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
db.products = require("./product.model")(sequelize,Sequelize)
db.product_in = require("./product_in.model")(sequelize,Sequelize)
db.product_out = require("./product_out.model")(sequelize,Sequelize)
//relation tabel User - Product
db.users.hasMany(db.products);

db.products.belongsTo(db.users, { as: 'suplier',
    foreignKey: "userId"
});

//Relation table products - product_ins
db.products.hasMany(db.product_in);

db.product_in.belongsTo(db.products, { 
    foreignKey: "productId"
});

//Relation table products - product_out
db.products.hasMany(db.product_out);

db.product_out.belongsTo(db.products, { 
    foreignKey: "productId"
});
module.exports = db