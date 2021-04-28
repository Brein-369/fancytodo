const {generateToken,verifyToken} = require('../helpers/jwt.js')
const {hashPassword, comparePassword} = require('../helpers/bcrypt.js')
const {Todo, User} = require('../models')
const axios = require('axios')
const {OAuth2Client} = require('google-auth-library')


class Controller{

    static register(req, res, next){
        let obj = {
            email : req.body.email,
            password : req.body.password
        }

        User.create(obj)
        .then(data=>{
            let objToShow = {
                id : data.id,
                email : data.email,
            }
            res.status(201).json(objToShow)
        })
        .catch(err=>{
            next(err)
        })
    }

    static login(req, res, next){
        User.findOne({
            where : {
                email : req.body.email
            }
        })
        .then(data=>{
            // conditional check paswword if email found
            if(data && comparePassword(req.body.password, data.password)){
                let payload = {
                    id : data.id,
                    email : data.email
                }
                res.status(200).json({
                    //payloadnya boleh ga kalo engga dimasukkin ?
                    ...payload,
                    access_token : generateToken(payload)
                })
            }
            else{
                next({name : '401', message : 'invalid email or password'})
            }
        })
        .catch(err=>{
            console.log(err);
            next(err)
        })
    }

    static loginGoogle(req,res,next){
        const googleToken = req.body.googleToken
        
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
        async function verify(){
            const ticket = await client.verifyIdToken({
                idToken : googleToken,
                audience : process.env.GOOGLE_CLIENT_ID
            })
            const googlePayload = ticket.getPayload()
            

            User.findOrCreate({
                where : {
                    email : googlePayload.email
                },
                defaults : {
                    //email tidak perlu dimasukkan defaults lagi karena sudah ke detect dari where
                    //password dibuat unique manual hanya agar tidak kena validation(space dihilangkan karena alhpanumeric)
                    password : (new Date()).toDateString().split(' ').join('')
                }
            })
            .then(data=>{
                //hasil data findOrCreate dalam bentuk array
                let payload = {
                    //payload ga boleh ada password
                    id : data[0].id,
                    email : data[0].email
                }
            
                res.status(200).json({
                    ...payload,
                    //generate token tetap dari jwt server
                    access_token : generateToken(payload)
                })
            })
        }
        verify().catch(console.error)
    }

    static showUsers(req, res, next){
        User.findAll()
        .then(data=>{
            res.json(data)
        })
        .catch(err=>{
            res.json(err)
        })
    }


    static getAllTodos(req, res, next){
        Todo.findAll({
            where : {
                UserId : req.currentUser.id
            }
        })
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(err=>{
            console.log(err);
            next({name : '500'})
        })
    }



    static postTodos(req ,res, next){
        let dataApiCurrency 
        let apiKey = process.env.API_KEY

        let obj = {
            title : req.body.title,
            description : req.body.description,
            due_date : req.body.due_date, 
            UserId : req.currentUser.id
        }
        axios({
            method :'get',
            url : `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
        })
        .then(responseAPI=>{
            dataApiCurrency = {
                time_updated : responseAPI.data.time_last_update_utc,
                base_currency : responseAPI.data.base_code,
                rate_IDR : responseAPI.data.conversion_rates.IDR
            }
            // console.log(dataApiCurrency);
            return Todo.create(obj)
        })
        .then(data=>{
            res.status(201).json({data, dataApiCurrency})
        })
        
        .catch(err=>{
    
            console.log(err);
            if (err.result === "error"){
                res.status(500).json({message : "server API error"})
            }
            else if(err.errors[0].type === 'Validation error'){
                next(err)
            }
            
            else{
                console.log(err);
                next({name : '500'})
            }
        })
    }
 


    static getIdTodos(req, res, next){
        Todo.findOne({
            where :{
                id : Number(req.params.id)
            }
        })
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(err=>{
            console.log(err);
            next(err)
        })
    }



    static putIdTodos(req, res, next){
        let obj ={
            title : req.body.title,
            description : req.body.description,
            due_date : req.body.due_date
        }
        Todo.update(obj, {
            where :{
                id : Number(req.params.id)
            },
            returning : true
        })
        .then(data=>{
            
            if(!data[0]){
                next({name : '404'})
            }
            else if(data){
                res.status(200).json(data[1][0])
            }
        })  
        .catch(err=>{
            console.log(err);
            if(err.errors[0].type === 'Validation error'){
                next(err)
            }
            else{
                console.log(err);
                next({name : '500'})
            }
        })
    }


    static patchIdTodos(req, res, next){
        let obj ={
            status : req.body.status
        }
        Todo.update(obj, {
            where :{
                id : Number(req.params.id)
            },
            returning : true
        })
        .then(data=>{
            console.log(data);
            if(!data[0]){
                next({name : '404'})
            }
            else if(data){
                res.status(200).json(data[1][0])
            }
        })  
        .catch(err=>{
            console.log(err);
        
            if(err.errors[0].type === 'Validation error'){
                next(err)
            }
            else{
                console.log(err);
                next({name : '500'})
            }
        })
    }
    


    static deleteIdTodos(req, res, next){
     
        Todo.destroy({
            where : {
                id : Number(req.params.id)
            },
            returning : true
        })
        .then(data=>{
            if(!data){
                next({name : '404'})
            }
            else if(data){
                res.status(200).json({message : "todo success to delete"})
            }

        })
        .catch(err=>{
            console.log(err);
            next({name : '500'})
        })


    }







}

module.exports = Controller