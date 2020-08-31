const db = require('../models/index')
const Product = db.products
const ProductOut = db.product_out
const User = db.users
exports.createProduct = async function (req,res){
    let date_ob = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2)
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
    // current year
    let year = date_ob.getFullYear()
    // current hours
    let hours = date_ob.getHours()
    // current minutes
    let minutes = date_ob.getMinutes()
    // current seconds
    let seconds = date_ob.getSeconds()
    // date & time in YYYY-MM-DD HH:MM:SS format
    let full_date = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

    const dataIn = {
        productId:req.body.product_id,
        date:full_date,
        total:req.body.total
    }

   await Product.findByPk(req.body.product_id,{attributes:['stock']})
                       .then(async (products)=>{
                        let prod = JSON.parse(JSON.stringify(products, null, 4))
                        let stock = prod.stock
                        let total_stock = stock-req.body.total
                        if (total_stock < 0) {
                            res.send({
                                status:'failed',
                                message:'stock tidak cukup!'
                            })
                            return
                        }
        await ProductOut.create(dataIn)
                        .then(async (data)=>{
                           await Product.update({stock:total_stock},{where:{id:req.body.product_id}})
                            .then(async (data)=>{
                              let update_prod = JSON.parse(JSON.stringify(data, null, 4))
                              res.send({
                                  product_id:req.body.product_id,
                                  date:full_date,
                                  total_in:req.body.total,
                                  total_stock:total_stock
                              })
                            })                        
                         })
    }) 
    
}

exports.getProductById = async function (req,res){
    await ProductOut.findByPk(req.params.in_id,{
                        attributes:['id','date','total'],
                        include:[{
                            model:Product,
                            as:'product',
                            attributes:['name','stock','price'],
                            include:[{
                                model:User,
                                as:'suplier',
                                attributes:['id','full_name','username','email','phone_number']
                            }]
                        }]
                    })
           .then(async (product_out)=>{
            let prod_out = JSON.parse(JSON.stringify(product_out, null, 4))
            const products ={
                name: prod_out.product.name,
                stock: prod_out.product.stock,
                price: prod_out.product.price,
                price_format: `Rp.${formatRupiah(prod_out.product.price)},-`,
                suplier:prod_out.product.suplier
            }
            const data = {
                id: prod_out.id,
                date: Date(prod_out.date),
                total: prod_out.total,
                product:products
            }
               res.send({
                message:"succes get data",
                status: "success",
                data:data
               })
            
           })
}

exports.getProductAll = async function (req,res){
    const pagination = parseInt(req.params.pagination)
    const limit      = parseInt(req.params.limit)
    const offset     =  limit-(limit/pagination)

   await ProductOut.findAll({attributes:['id','date','total'],
                        include:[{
                            model:Product,
                            as:'product',
                            attributes:['name','stock','price'],
                            include:[{
                                model:User,
                                as:'suplier',
                                attributes:['id','full_name','username','email','phone_number']
                            }]
                        }],
                    offset:offset,limit:limit})
            .then(async (products)=>{
                //let prod = JSON.parse(JSON.stringify(products, null, 4))
                let data = []
                for (const key in products) {
                    if (products.hasOwnProperty(key)) {
                        const prod = products[key];
                        const product_detail ={
                            name: prod.product.name,
                            stock: prod.product.stock,
                            price: prod.product.price,
                            price_format: `Rp.${formatRupiah(prod.product.price)},-`,
                            suplier:prod.product.suplier
                        }
                       let isi = {
                                id: prod.id,
                                date: Date(prod.date),
                                total: prod.total,
                                product:product_detail
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