// .Schema,.model mongoose ke andar defined
const mongoose=require("mongoose");

// main kaam index.js me to connection phir se nhi bnaya
const chatSchema=new mongoose.Schema({
    // id apne aap generate
    from:{
        type:String,
        required:true//not null
    },
    to:{
        type:String,
        // required:true
    },
    msg:{
        type:String,
        maxLength:50
    },
    created_at:{
        type:Date,
        required:true
    }
})

// show collections=> chats
const Chat=mongoose.model("Chat",chatSchema);

module.exports=Chat;