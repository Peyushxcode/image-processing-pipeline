const express = require("express");
const uploadRoute = require("./upload");
const app = express();
app.use(express.json());

app.get("/" , (req,res) =>{
    res.send("Image pipeline running");
})

app.use("/upload" , uploadRoute);

app.listen(3000 , () => {
    console.log("Server is listening on port 3000");
})