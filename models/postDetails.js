const mongoose =require("mongoose")

const userPostScheme=new mongoose.Schema({
   
   
    postimg:{
        type:String,
        require:true,
        

    },
    user:{
        type:String,
       
        trim:true
    },
    userproimg:{
        type:String,
       
        trim:true
    },
    user_id:{
        type:String,
       
        trim:true
    },
    likes:{
        type:Number,
        default:0
    },
    views:{
        type:Number,
        default:0
    },
   
    date:{
        type:Date,
        default:Date.now
    }
})

const userPostTable=new mongoose.model('userPost',userPostScheme);
module.exports =userPostTable