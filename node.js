const express=require("express");
const app=express();
const mongoose=require("mongoose");
app.use(express.json());
//This is my db connection without wsib stupid security block
mongoose.connect("mongodb://localhost:27017/myMongo",{

});



//SHANES SCHEMA
const schema={
    name:String,
    email:String,
    id:Number
}

const monmodel=mongoose.model("mpn",schema);


//POST
app.post("/post", async(req,res)=>{


const data=new monmodel({
    name:req.body.name,
    email:req.body.email,
    id:req.body.id

});

try{
const val=await data.save();
res.json(val);
}catch(err)
{
    res.status(500).send("Error saving data");
}
});


mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

//PUT
app.put("/update/:id", async (req,res)=>{
   const upid = parseInt(req.params.id);

    const upname = req.body.name;
    const upemail = req.body.email;

    try{
        const data = await monmodel.findOneAndUpdate({id:upid}, { $set: { name: upname, email: upemail } }, { new: true });
        if (!data){
            res.status(404).send("No ID found");
        }else  {
            res.send(data);
        }
    }catch(err)
         {
            console.log("Something went wrong with your update");
            res.status(500).send("Internal server error");
         }

});


//FETCH GET

app.get('/fetch/:id', async (req,res)=>{
    const fetchid= parseInt(req.params.id);
    try{

        const val = await monmodel.find({id:fetchid});

        if(val.length === 0){
            res.send("Data is none existent");
        }else{
            res.send(val);
        }
        }catch(err){
        
            res.status(500).send("Error fetching the data");
        
    }
    });



//DELETE

app.delete("/del/:id",async (req,res)=>{
    const delid= parseInt(req.params.id);
    try{
    
    const docs = await monmodel.findOneAndDelete({id:delid});
        if(!docs){
            res.send("Wrong ID");
        }else{
        
            res.send(docs);
        }
    }catch(err){

        res.status(500).send("Error deleting data");
        }
        });

// Get all names that start with SH
app.get('/fetch-name-starts-with/:letter', async(req,res)=> {
    const letter = req.params.letter;
    try{
        const regex = new RegExp(`^${letter}`, 'i');
        const results = await monmodel.find({name:{$regex: regex}});
        if (results.length === 0){
            res.send("Nonames found starting with the given letter");
        }else{
            res.send(results);
        }

    }catch(err){
        console.error("Error fetching data:",err);
        res.status(500).send("Error fetching data");
    }
});

app.listen(3001,()=>{
    console.log("on port 3001");

});
