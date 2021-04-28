


const errorHandler = (err,req,res,next)=>{
    
    console.log(err.name);
    if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError' ){
        let theErr = err.errors.map(e=>{
            return e.message
        })
        res.status(400).json(theErr)
    }
    else if(err.name === '401'){
        res.status(401).json({message : "Authorization Error", detail : err.message ? err.message : 'no detail given'})
    }

    else if(err.name === '404'){
        res.status(404).json({message : "Error Resource Not Found", detail : err.message ? err.message : 'no detail given'})
    }
    
    else{
        res.status(500).json({message : "Internal Server Error", detail : err.message ? err.message : 'no detail given'})
    }
}

module.exports = errorHandler