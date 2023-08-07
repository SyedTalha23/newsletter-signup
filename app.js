//do "npm install" to install the required dependencies and modules

const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function (req, res) { 
    res.sendFile(__dirname+"/signup.html");
 })

app.post("/",function(req,res){
    var firstName=req.body.firstName
    var lastName=req.body.lastName
    var email=req.body.emailAddress
    console.log(firstName,lastName,email);

    var data={
        members:[
            {
                email_address:email,
                status: "subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName,
                }
            }
        ]
    }

    var jsonData= JSON.stringify(data);

    var url="https://us9.api.mailchimp.com/3.0/lists/d958a2071b"
    const options={
        method:"POST",
        auth:"anystring:6ce269c3d6709189058391406222139f-us9"
    }
    const request=https.request(url,options,function(response){
        console.log("status code= ",response.statusCode)
        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html")  ;
        }
        else{
            res.sendFile(__dirname+"/failure.html")  ;
        }


        response.on("data",function(data){
            let mailchimpResponseData=JSON.parse(data);
            console.log(mailchimpResponseData)
            console.log("error count= ",mailchimpResponseData.error_count);            

        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure.html", function(req,res){
    res.redirect("/");
})


app.listen(process.env.PORT ||  3000,function(){
    console.log("server running in port 3000");
})

// newslettersignup
// authentication 
// 6ce269c3d6709189058391406222139f-us9

// list id 
// d958a2071b
