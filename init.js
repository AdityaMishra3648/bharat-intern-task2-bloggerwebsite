// database ko initialize krne k code
// ise me connection setup
// jb bhi data phir se dalna node init.js terminal me likho

// index.js aur init.js k koi direct link nhi 
// chuki dono hi same db whatsapp pr kaam kr rhe
// to db ke through link bna

const mongoose=require("mongoose");
// collections(models) required 
const Chat=require("./models/chat.js");

main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

// database in form of arr of obj
let allChats=[
    // document 1 of collection
{
    from:"neha",
    to:"priya",
    msg:"send me your exam sheets",
    created_at:new Date()
},
// document 2 of collection
{
    from:"rohit",
    to:"modit",
    msg:"teach me js callback",
    created_at:new Date()
},
{
    from:"amit",
    to:"sumit",
    msg:"all the best",
    created_at:new Date()
},
{
    from:"tony",
    to:"peter",
    msg:"love you 3000",
    created_at:new Date()
}];

Chat.insertMany(allChats);