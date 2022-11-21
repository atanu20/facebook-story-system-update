const express=require('express')
const mongoose = require('mongoose');
const cors=require('cors')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const fileUpload=require("express-fileupload");
const fs = require('fs');
const path = require('path');
const random = require('random')
const saltRounds = 10;
var router = express.Router();
const PORT =process.env.PORT || 8000;
require("./db/config")
const userDetailsTable=require('./models/userDetails')
const userPostTable=require('./models/postDetails')
const storyTable=require('./models/storyPost')
const likeTable=require('./models/PostLikes')
const app=express()
app.use(cors())
app.use(express.json())
app.use(fileUpload())

router.get("/",(req,res)=>{
    res.send("hii")
})







router.post("/register", async (req,res)=>{

  
    try{
        const exist=await userDetailsTable.findOne({email:req.body.email})
        if(exist)
        {
            res.send({msg:"email already exist"})
        }
        else{     
        
    
           
            

                    const password=req.body.password;
                    const hash=await bcrypt.hash(password, saltRounds);
                    
                        const usedet=new userDetailsTable({name:req.body.name,email:req.body.email,profilePicture:req.body.postimg,password:hash})
                        // console.log(usedet)
                        const up=new storyTable({ user_id:usedet._id})
                        await up.save()
                       await usedet.save();
                    res.status(201).send({submit:true})       
                    
        
              
           
            
        }
        

    }catch(err){
        console.log(err)
    }
})

const verifyJwt=(req,res,next)=>{
    const token=req.headers["x-access-token"]

    if(!token)
    {
        res.send({login:false,msg:"need token"});
    }
    else{
        jwt.verify(token,'FAceBookStoryclone',(err,decoded)=>{
            if(err)
            {
                res.send({login:false,msg:"need to token"});
            }
            else{
                req.userID=decoded.id;
                next();
            }
        })
    }
}

router.get("/isAuth",verifyJwt,(req,res)=>{
    res.send({login:true,msg:"done"});
})



router.post("/login",async(req,res)=>{
   try{
    const email=req.body.email;
    const password=req.body.password;
    const exist=await userDetailsTable.findOne({email:email})
    
    if(exist)
    {
    
        bcrypt.compare(password, exist.password,  (errr,response)=>{
            if(response)
            {
               
               const id=exist._id;
            //    console.log(id)
               const token=jwt.sign({id},"FAceBookStoryclone",{
                   expiresIn:60*60*24,
               })
           
               res.status(200).send({login:true,token:token,name:exist.name,userID:exist._id,userEmail:exist.email})
                // res.send({login:true,username:exist.username})

            }
            else{
             res.send({login:false,msg:"Wrong Password"});
            
            }
        })
        
    }else{
        res.send({login:false,msg:"invalid email"})
    }


   }catch(err){
    console.log(err)
   }
})







router.post("/uploadpost",async (req,res)=>{
   
    try{
        
           
        
      
      
        
               
    const user_id=req.body.user_id;
    const exist=await userDetailsTable.findById(user_id)
                
                const usedet=new userPostTable({postimg:req.body.postimg,user:exist.name, userproimg:exist.profilePicture, user_id:req.body.user_id})

                const result=await storyTable.findOne({user_id:user_id})
                // console.log(result)
                const ress= await storyTable.findByIdAndUpdate(result._id, { 
                    postimg:req.body.postimg,
                   user:exist.name,
                   userproimg:exist.profilePicture,
                   user_id:req.body.user_id,
                   savepostid:usedet._id,
                   likes:0,
                   views:0,
                   expireIn:Date.now()+ 86400000,
                   date : new Date()

                },{ new: true });

                const resu= await usedet.save();
            //   res.status(201).send({msg:"Profile done"})   
            res.json({submit:true})
               
            
                
    
          
      
    
        

    }catch(err){
        console.log(err)
    }

})

router.get('/checkupload/:id',async(req,res)=>{
    try{



        const result=await storyTable.find({user_id:req.params.id})
        if(result.length)
        {
            
             const date2 = Date.now();
            // const diffTime = ( result[0].expireIn-date2);
            // console.log(result[0].expireIn)
            // console.log(date2)
            // console.log(diffTime)

            if(result[0].expireIn>date2)
            {
                res.json({submit:true})
            }
            else{
                res.json({submit:false})
            }

        }
        else{
            res.json({submit:false})
        }
       
        
        
    }
    catch(err){
        console.log(err)
    }
})

router.get('/allstory',async(req,res)=>{
    try{
        const result=await storyTable.find({expireIn:{$gt: Date.now()}})
        res.send(result)
        
    }
    catch(err){
        console.log(err)
    }
})


router.get('/myprofile/:id',async(req,res)=>{
    try{
        const result=await userDetailsTable.findById(req.params.id)
        res.send(result)
        
    }
    catch(err){
        console.log(err)
    }
})

router.get('/storybyid/:id',async(req,res)=>{
    try{
        const result=await storyTable.findById(req.params.id)
        
            res.send(result)
       
        
    }
    catch(err){
        console.log(err)
    }
})

router.post("/like",async(req,res)=>{
    try{
        const post = await storyTable.findOne({_id:req.body.postid});
        const updatedPost = await storyTable.findByIdAndUpdate({_id:req.body.postid}, {likes: post.likes + 1 }, { new: true });
        const savepost = await userPostTable.findOne({_id:req.body.savepostid});
        const saveupdatedPost = await userPostTable.findByIdAndUpdate({_id:req.body.savepostid}, {likes: savepost.likes + 1 }, { new: true });

        const usedet=new likeTable({uid:req.body.uid, postid:req.body.postid , savepostid:req.body.savepostid})
        const resu= await usedet.save();
        res.json({submit:true})
    }
    catch(err){
        console.log(err)
    }
})


router.post("/checklike",async(req,res)=>{
    try{
        const result = await likeTable.find({uid:req.body.uid,postid:req.body.postid,savepostid:req.body.savepostid});
        if(result.length)
        {
            res.json({submit:true})
        }
        else{
            res.json({submit:false})
        }
        
        
    }
    catch(err){
        console.log(err)
    }
})

router.post("/views",async(req,res)=>{
    try{
        const post = await storyTable.findOne({_id:req.body.postid});
        const updatedPost = await storyTable.findByIdAndUpdate({_id:req.body.postid}, {views: post.views + 1 }, { new: true });
        const savepost = await userPostTable.findOne({_id:req.body.savepostid});
        const saveupdatedPost = await userPostTable.findByIdAndUpdate({_id:req.body.savepostid}, {views: savepost.views + 1 }, { new: true });

        
        res.json({submit:true})
    }
    catch(err){
        console.log(err)
    }
})

router.post('/likeusers',async(req,res)=>{
    try{
        const result = await likeTable.find({savepostid:req.body.savepostid,postid:req.body.postid});
        

        const likepost=[]
        
        
        const users = await Promise.all(
            result.map((val) => {
            return userDetailsTable.findById( val.uid);
          })
        );
        res.json(likepost.concat(...users))
        

    }
    catch(err){
        console.log(err)
    }
})
























app.use(router)

app.listen(PORT,()=>{
    console.log(`App running on ${PORT}`)
})