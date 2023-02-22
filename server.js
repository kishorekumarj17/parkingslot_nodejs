const express= require('express')
const cors= require('cors')
const app= express()
const router = require('./app/routes/routes')

var options={
    origin:"http://localhost:4200"
}

app.use(cors(options))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.json({message:'Hello there'})
})

app.use(router)

const Port=process.env.PORT || 8080

app.listen(Port,()=>{
    console.log("Server running")
})