const {User, Todo} = require('../models')
const {verifyToken} = require('../helpers/jwt.js')

const authenticate = (req,res,next)=>{
    //fungsi try catch supaya kalo req headers access tokennya salah bisa di catch(error)
    try {
        //proses decode menggunakan destructuring
        //access token selalu didapat dari req.headers
        
        let {id, email}  = verifyToken(req.headers.access_token)
        
        User.findByPk(id)
        .then(data=>{
            //setiap route akan dibuat req.currentUsernya dari router.use authenticate
            req.currentUser = {
                id : data.id,
                email : data.email
            }
            
            next()
        })
        .catch(err=>{
            //kalo di throw nanti otomatis di catch error yang se-level try
            throw Error()
        })
    } 
    catch (error) {
        next({name : '401'})
    }
}

const authorize = (req,res,next)=>{
    //mencari todo berdasarkan idnya
    let idTodo = Number(req.params.id)
    Todo.findByPk(idTodo)
    .then(data=>{
        if(data === null){
            next({name : '404', message : 'todo id not found'})
        }
        //req.currentUser bisa dipake karena masih satu route
        if(data.UserId === req.currentUser.id){
            next()
        }
        else{
            next({name : '401', message : 'different user ID'})
        }
    })
    .catch(err=>{
        next({name:'500'})
    })
}

module.exports = {
    authenticate,
    authorize
}