var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
const db = require('../models/index')
const Product = db.products
const User = db.users
exports.createProduct = function (req,res){
    //create product
    var user = (jwt.verify(req.headers.token,process.env.SECRET))
    //Validate request
    if (!req.body.name) {
        res.status(400).send(
            {
                message: "Name cannot be empty"
            }
        )
        return
    }
    const product = {
        name: req.body.name,
        stock: req.body.stock,
        price: req.body.price,
        userId: user.id
    }
    Product.create(product)
           .then((data)=>{
                res.send({data:data})
            }).catch((err)=>{
                res.status(500).send({
                    message: err.message || "some error occured while creating Post"
                })
            })
}

exports.getProductById = function (req,res){
    Product.findByPk(req.params.product_id,{
                        attributes:['name','stock','price'],
                        include:[{
                            model:User,
                            as:'suplier',
                            attributes:['id','full_name','username','email','phone_number']
                        }]
                    })
           .then((products)=>{
            let prod = JSON.parse(JSON.stringify(products, null, 4))
            const data = {
                name: prod.name,
                stock: prod.stock,
                price: prod.price,
                price_format: `Rp.${formatRupiah(prod.price)},-`,
                suplier:prod.suplier
            }
               res.send({
                message:"succes get data",
                status: "success",
                data:data
               })
            
           })
}
exports.getProductAll = function (req,res){
    const pagination = parseInt(req.params.pagination)
    const limit      = parseInt(req.params.limit)
    const offset     =  limit-(limit/pagination)

    Product.findAll({attributes:['name','stock','price'],
                    include:[{
                        model:User,
                        as:'suplier',
                        attributes:['id','full_name','username','email','phone_number']
                    }],
                    offset:offset,limit:limit})
            .then((products)=>{
                //let prod = JSON.parse(JSON.stringify(products, null, 4))
                let data = []
                for (const key in products) {
                    if (products.hasOwnProperty(key)) {
                        const prod = products[key];
                       let isi = {
                            name: prod.name,
                            stock: prod.stock,
                            price: prod.price,
                            price_format: `Rp.${formatRupiah(prod.price)},-`,
                            suplier:prod.suplier
                        }
                        data.push(isi)
                    }
                }
                res.send({
                    message:"succes get data",
                    status: "success",
                    data:data,
                    totalItems:data.length,
                    totalpages:parseInt(data.length/offset)?  parseInt(data.length/offset) : 1,
                    currentpage:pagination
                   })
            })
}
exports.editProduct = async function (req,res) {
    const product_id = req.params.id
    const user = (jwt.verify(req.headers.token,process.env.SECRET))
    const data = {
        name: req.body.name,
        stock: req.body.stock,
        price: req.body.price,
        userId: user.id
    }
    await Product.update(data,{where:{id:product_id}})
                              .then(async(results)=>{
                                res.send({
                                    message:"succes update data",
                                    status: "success",
                                    data:data
                                   })
                              })
}

exports.deleteProduct = async function(req,res){
    const product_id = req.params.id
     Product.destroy({where:{id:product_id}})
              .then( (data)=>{
                  res.send({
                      status:"success",
                      message:`success delete product with primary key : ${user_id_delete}`
                  })
              })

}
function formatRupiah(angka, prefix){
    angka = String(angka)
    var number_string = angka.replace(/[^,\d]/g, '').toString(),
    split   		= number_string.split(','),
    sisa     		= split[0].length % 3,
    rupiah     		= split[0].substr(0, sisa),
    ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if(ribuan){
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}