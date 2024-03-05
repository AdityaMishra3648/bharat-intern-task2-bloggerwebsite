const express=require("express");
const app=express();
const path=require("path");

// update aur delete route ke liye
const methodOverride=require("method-override");

// isme andar model k schema defined h
const Chat=require("./models/chat.js");

// to serve static files join the path of index.js and views
app.set("views",path.join(__dirname,"views"));
// samajh lo express k andar koi view engine naam ki property hoti hogi
// ejs install ke baad unko ejs me set kr diya
app.set("view engine","ejs");

// public folder se static file
// ye middleware h
app.use(express.static(path.join(__dirname,"public")));

// jb chats me post req ayegi tb req.body ko access ke liye
app.use(express.urlencoded({extended:true}));

app.use(methodOverride("_method"));


// connection setup for moongoose to link vscode with mongoose
const mongoose=require("mongoose");
// main func call
// as main async func to promise bhi return krega
main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
})
// main func definition
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

app.listen(8080,()=>{
    console.log("server listening at port 8080");
})


app.get("/",(req,res)=>{
    res.send("root is working");
})



// chat.js

// dp.chats.find se ye dikhega
// let chat1=new Chat({
//     from:"neha",
//     to:"priya",
//         // msg schema me define n ki message to ye save hi n hua
//     msg:"send me your exam sheets",
//     // message:"send me your exam sheets",
//     // date class exist joki random date deti
//     created_at:new Date()
// })
// chat1.save()
// .then((res)=>{
//     console.log(res);
// })


// index route
// error handling ke liye try catch block k use
app.get("/chats",async (req,res,next)=>{
    try{
        let chats=await Chat.find();
        // koi filter n pass kiya to puri chat find
        // as Chat.find() func joki database(Chats require kiya tha) se data laya
        // to async function to promise return
        // to await keyword use
        // to callback bhi async bnao 
        // console.log(chats);
        // in chats ko frontend me bhjena

        // res.send("chats working");
        console.log(chats);
        res.render("index.ejs",{chats});
    }
    catch(err)
    {
        next(err);
    }
    
})

// chats/new pr jb get request aai new route bnao
// app pr jb get request ayi tb ye active hoga
// normal(async nhi) func me expresserror de skte seedhe
app.get("/chats/new",(req,res)=>{
    // throw new ExpressError(404,"Page not found");
    res.render("new.ejs");
    // get req to url me sb visible
})


// create (post ) route /chats
// post to data req ki body me
// app.post("/chats",(req,res)=>{
app.post("/chats",async (req,res,next)=>{

    // error handling k topic
    // agar validation error aaye
    // use try and catch
    // place all code in try block
    try
    {
        // samajh lo post aur upar wali get ek sath call to
        // db me change aur display ek sath hi hoyega
        let {from,to,msg}=req.body;
        // Chat file me Chat defined as=>  const Chat=mongoose.model("Chat",chatSchema);
        let newChat=new Chat({
            from:from,
            to:to,
            msg:msg,
            created_at:new Date()
        });
        // console.log(newChat);
        let result=await newChat.save();
        console.log(result);
        /*
        newChat
        .save()
        // ye async func pr then use kiya to await async n likhna pda
        
        
        .then((res)=>{
            console.log("chat was saved");
            console.log(res);
        })
        .catch((err)=>{
            console.log(err);
        });
        */
        // ye chat permanently db me save ho chuki 
        // res.send("post chat working");
        res.redirect("/chats");
    }
    catch(err)
    {
        next(err);//default error middleware
        // res.send(err);
    }

    
})

// edit route
// error handling
app.get("/chats/:id/edit",async (req,res,next)=>{
    try{
        let {id}=req.params;//query string me
        // findbyid async function
        let chat=await Chat.findById(id);
        res.render("edit.ejs",{chat});
    }
    catch{
        next(err);
    }
    
})

// update route
//npm i method-override
app.put("/chats/:id",async (req,res)=>{
    try{
        let {id}=req.params;
        let {msg:newMsg}=req.body;//form k method post to req.body
        let updatedChat=await Chat.findByIdAndUpdate(
            id,//filter as id
            {msg:newMsg},//update query
            {runValidators:true,new:true}//new=true se updated value print
            // runValidators:true se schema ke validators ki condition bhi check hogi

        );

        console.log(updatedChat);
        res.redirect("/chats");
    }
    catch(err)
    {
        next(err);
    }
    
})

/*
// destroy route
app.delete("/chats/:id",async (req,res)=>{
    try{
        let {id}=req.params;
        let deletedChat=await Chat.findByIdAndDelete(id);
        console.log(deletedChat);
        res.redirect("/chats");
    }
    catch(err){
        next(err);
    }
    
})
*/
app.delete("/chats/:id",asyncWrap(async (req,res,next)=>{
    let {id}=req.params;
    // let deletedChat=await Chat.findByIdAndUpdate(id);
    let deletedChat=await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
}))


// kisi random route /chats/new me error throw kro
// normal func me kaam krega
// async func me nhi
// throw error in /chats/:id
/*
app.get("/chats/:id",async (req,res,next)=>{

    try{//mongoose id ko _id me typecast krta
        // agar typecasting me err ayegi due to diff in len of id
        // to use try block handle krega
        let {id}=req.params;
        let chat=await Chat.findById(id);

        // error
        if(!chat)
        // throw new ExpressError(404,"Chat not found");
    // async func me next ko implicitly call n lgti
    // explicity call krna pdta
        {
            // glt id aur sahi id same len ki hone chahiye
            next(new ExpressError(404,"Chat not found"));
        }
        // agar err n throw kre aur glt id dale to findbyid 
        // moongoose invalid chat return krta
        // to invalid ko jb parse kiya to error ejs generate krta
        res.render("show.ejs",{chat});
    }
    catch(err)
    {
        next(err);
    }
    
})*/
// show route k new way of writing jaha para me pura func dala

app.get("/chats/:id",asyncWrap( async (req,res,next)=>{
    let {id}=req.params;
    let chat=await Chat.findById(id);
    if(!chat){
        next(new ExpressError(500,"Chat not found"));
    }
    // res.render("edit.ejs",{chat});
    res.render("show.ejs",{chat});
}))



// aynnc wrap func
function asyncWrap(fn){
    return function(req,res,next){
        // execution of para func f1
        fn(req,res,next)
        .catch(
            (err)=>{
                next(err);
            }
        );
    }
}

/*
const f1=()=>console.log("hello");
f1();//output=hello
const returnf1=asyncWrap(f1);
returnf1();//output=hello
// returnf1==f1 two ways se same func define

*/


// handling error k subtopic

const ExpressError=require("./ExpressError");

// is err handling midware k kaam err k naam print krana hoga
app.use((err,req,res,next)=>{
    // agar schema k validation err to===ValidationError
    // agar nonexisting route me get===CastError
    // agar galat same len ki id===Error
    // agar galat id of diff len===CastError
    console.log(err.name);
    if(err.name=="ValidationError")
    // console.log("This is a validation err, please follow rules");
    err=handleValidationErr(err);//call to func
    next(err);//agle err handling midware ko call
})

// jb particular err aye use handle 
const handleValidationErr=(err)=>{
    console.log("This is  validation error,please follow rules");
    console.log(err.message);
    return err;
}


// error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="Some Error Occured"}=err;
    res.status(status).send(message);
})