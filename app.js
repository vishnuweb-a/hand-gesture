const express  = require('express')
const cookie = require('cookie-parser')
const path = require('path');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

const userModel = require('./model/user');
const { hash } = require('crypto');
app.use(cookie());

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))

app.set("view engine","ejs")

app.get('/',(req,res)=>{
  res.render("index");
})

app.post('/create',  (req,res)=>{
 let {username, email, password, age} = req.body;
  
 
  bcrypt.genSalt(10,(err,salt)=>{
    
  bcrypt.hash(password,salt, async (err,result)=>{
  
 let createdUser = await userModel.create({
   username,
    email,
    password:result,
    age
  });

 let token = jwt.sign({email},"vishnu");
 res.cookie("token",token);
 console.log(req.cookies.token)
  
  res.send(createdUser);
  })

 
})
})

app.get('/login',(req,res)=>{
  res.render("login")
})

app.post('/login', async (req,res)=>{
  let user =await userModel.findOne({email:req.body.email})
  if(!user) return res.json({ message: "unsuccsfull." });


    bcrypt.compare(req.body.password, user.password,(err,result)=>{
      if(result){
        res.send("login successfully")
        let token =jwt.sign({email :user.email},"vishnu")
      }
      else{
       res.send("login unsuccessfully .");
      }
    })
})



app.get('/logout',(req,res)=>{
  res.cookie("token","");
  res.redirect('/')
})





app.listen(3000,()=>{
  console.log("server is on .")
})