//dotenv should be here
if(process.env.NODE_ENV === 'development'){
    require('dotenv').config()
}


const express = require('express')
const app = express()
const allRoutes = require('./routes')
const cors = require('cors')
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(allRoutes)


app.listen(port, ()=>{
    console.log(`port is on at ${port}`)
})