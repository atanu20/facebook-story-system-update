const mongoose =require("mongoose")

const storyScheme=new mongoose.Schema({
   
   
    postimg:{
        type:String,
        require:true,
        default: "",

    },
    user:{
        type:String,
        default: "",
        trim:true
    },
    userproimg:{
        type:String,
        default: "",
        trim:true
    },
    user_id:{
        type:String,
        default: "",
        trim:true
    },
    savepostid:{
        type:String,
        default: "",
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
    expireIn:{
        type:Number,
        default:0
    },
   
    date:{
        type:Date,
        default:Date.now
    }
})

const storyTable=new mongoose.model('storypost',storyScheme);
module.exports =storyTable