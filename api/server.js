import express from 'express'

const app = express();

app.get("/", function(req,res){
    res.send("Hello from Express server!");
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
})
