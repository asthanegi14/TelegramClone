require("dotenv").config();
const express = require("express");
const collection = require("./database");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const OTPGenerator = require("otp-generator");
const jwtToken = require("jsonwebtoken");
const auth = require("./auth");
const myMail = process.env.myMail;
const myMailPass = process.env.myMailPass;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get("/", cors(), (req, res)=>{

})

app.post("/login", async(req, res)=>{
    const{email, password} = req.body
    console.log("loggin...");

    try{
        const user = await collection.findOne( {email:email})
        
        if(!user){
            return res.json("this email is not registered");
        }

        if(!password){
            return res.json("Password can not be empty");
        }

        const passMatch = await bcrypt.compare(password, user.password);

        if(user && passMatch){
            const myToken = jwtToken.sign({
                username: user.username,
                userId: user._id
                }, process.env.privateKey, {expiresIn:"1d"});
            return res.json({msg: "login successfully", username: user.username, token: myToken, phone: user.phone});
        }

        return res.json("Wrong Password");        
    }

    catch(e){
        return res.json("error occurd");
    }
})


app.post("/register", async(req, res)=>{
    const{username, password, email, phone, address} = req.body
    try{
        const isValidEmail = await collection.findOne({email:email})
        const isValidUsername = await collection.findOne({username:username})

        if(isValidUsername){
            return res.json("Username already exist, please try other username.");
        }
        if(isValidEmail){
            return res.json("User with this email is already exist");
        }

        const pass = await bcrypt.hash(password, 10);

        const data = await collection.create({
            email: email,
            username: username,
            password: pass,
            phone: phone,
            address: address,
        });
        return res.json("registered successfully");
    }

    catch(e){
        res.json("error occurd");
    }
})

app.post("/reset", async(req, res)=>{
    const {email} = req.body;
    const userName = await collection.findOne({email:email});
    
    if(!userName){
        return res.json("This Email is Not registered");
    }
    const otp = OTPGenerator.generate(4, { digits: true, alphabets: true, upperCase:true, specialChars: true });

    const sendMails = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: myMail,
            pass: myMailPass
        }
    });

    sendMails.sendMail({
        from: myMail,
        to: email,
        subject: 'OTP for password reset',
        text: `Hello ${userName.username}, 
        this is your 4 digit OTP ${otp} to reset your password.` 
    }, (e, info)=>{
        if(e){
            return res.json("Failed to send OTP");
        }
    });
    return res.json({msg:"OTP sent successfully", otp: otp});
});

app.put("/changePassword", async(req, res)=>{
    const {mail, password} = req.body;
    const userData = await collection.findOne( {email:mail})
    
    try{
        if(!userData){
            return res.json("No user is registered with this email address");
        }
        if(userData.password == password){
            res.json("New Password can not be equal to previous password");
        }
        else{
            const pass = await bcrypt.hash(password, 10);
            await collection.findByIdAndUpdate(userData.id, {password: pass});
        }

        return res.json("Password updated successfully"); 
    }
    catch(e){
        console.log(e);
    }

    return res.json("Password changed successfully");
});

app.post("/profile", auth.Auth, async(req, res)=>{
    const {email} = req.body;

    const user = await collection.findOne(
        { email: email },
        { projection: { password: 0 } }
    );
    
    if(user==null){
        return res.json("Not signed in yet");
    }

    return res.json({msg:"logged in", content:user}); 
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}.....`);
})

