var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
const db = require('../models/index')
const User = db.users
//register
exports.signup = function (req,res) {
    //Validate Request
    if (!req.body.email || !req.body.password) {
        res.status(400).send(
            {
                message: "Content cannot be empty"
            }
        )
        return
    }

    //Create User
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(req.body.password,salt)
    User.findOne({where : {password: hash,salt:salt}})
        .then((data)=>{
            if(data){
                // kalau password dan salt ada yang sama, generate salt yang beda
                // agar mencegah hash password yang sama pada database
                salt = bcrypt.genSaltSync(10)
                hash = bcrypt.hashSync(req.body.password,salt)
            }
            const user = {
                full_name   : req.body.full_name,
                username    : req.body.username,
                phone_number: req.body.phone_number,
                salt        : salt,
                password    : hash,
                email       : req.body.email,
                role        : req.body.role
            }
            User.create(user)
            .then((data) =>{
                res.send({data: data})
            }).catch((err)=>{
                res.status(500).send({
                    message : err.message || "some error occured"
                })
            })
        }) 
}

exports.signin = function (req, res){
    var email = req.body.email
    var pass  = req.body.password

    User.findOne({where : {email: email}})
        .then((data)=> {
            var hasil = bcrypt.compareSync(pass, data.password)
            //console.log(hasil)

            if (hasil == true) {
                var secret = process.env.SECRET

                var expiresIn = "30 days" 

                jwt.sign({id:data.id},secret, {
                    algorithm: 'HS256',
                    expiresIn: expiresIn
                },
                    function(err,token) {
                        if (err) {
                            res.json({
                                "results":
                                {
                                    "status" : false,
                                    "msg"    : "Error Occured"
                                }
                            })
                        } else {
                            if (token != false) {
                                res.header()
                                res.json({
                                    "results":
                                    {
                                        "status":true,
                                        "token": token,
                                        "user": {
                                            id : data.id
                                        }
                                    }
                                })
                                res.end()
                            }else{
                                res.json({
                                    "results":
                                    {"status": false}
                                })
                                res.end()
                            }
                        }                       
                    }
              )
            }else{
                res.send({
                    message: `Error retrieving post with id = ${err}`
                })
                res.end()
            }
        }).catch((err) => {
            res.status(500).send({
                message: `Error retrieving post with id = ${err}`
            })
        })
}


exports.getId = function (req, res) {
    User.findByPk(req.params.id) //harus = index.js
        .then((data) => {
            res.send({message:"succes get data",
                      status: "success",
                      data:data
                    });
        //response.ok(data,res)
        })
        .catch((err) => {
            res.send({error:err});
    });
};

exports.getAll = function (req, res) {
    const pagination = parseInt(req.params.pagination)
    const limit      = parseInt(req.params.limit)
    const offset     =  limit-(limit/pagination)
    User.findAll({offset:offset,limit:limit}) //offset nya tergantung pagiation
        .then((data) => {
            res.send({message:"succes get data",
                      status: "success",
                      data:{data:data},
                      totalItems:data.length,
                      totalpages:parseInt(data.length/offset)?  parseInt(data.length/offset) : 1,
                      currentpage:pagination
                    });
        })
        .catch((err) => {
            res.send({error:err});
    });
};

exports.editUser = async  function(req,res) {
    const user_id = req.params.id
    await User.findByPk(user_id)
              .then(async(data)=>{
                let user_data = JSON.parse(JSON.stringify(data, null, 4))
                let salt = user_data.salt
                    var hash = bcrypt.hashSync(req.body.password,salt)
                    let with_password_data = {
                        full_name   : req.body.full_name,
                        username    : req.body.username,
                        phone_number: req.body.phone_number,
                        email       : req.body.email,
                        role        : req.body.role,
                        salt        : salt,
                        password    : hash
                    }
                    await User.update(with_password_data,{where:{id:user_id}})
                              .then(async(results)=>{
                                res.send({
                                    message:"succes update data",
                                    status: "success",
                                    data:with_password_data
                                   })
                              })
                
              })
}

exports.deleteUser = async function(req,res){
    const user_login = (jwt.verify(req.headers.token,process.env.SECRET))
    const user_id_login = user_login.id
    const user_id_delete = req.params.id
    if (user_id_login == user_id_delete) {
        res.send({
            status:'failed',
            message:'Cannot delete your own account'
        })
        return
    }
     User.destroy({where:{id:user_id_delete}})
              .then( (data)=>{
                  res.send({
                      status:"success",
                      message:`success delete user with primary key : ${user_id_delete}`
                  })
              })

}