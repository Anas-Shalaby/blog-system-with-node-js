const express = require("express");
const router = express.Router();
const post = require("../models/Post.js");
const User = require("../models/User.js");
const bcrypt  = require("bcrypt");
const  jwt = require("jsonwebtoken");
const adminLayout = '../views/layouts/admin';



/**
 * 
 * admin - CHECK LOGIN
 */

const authMiddleware = (req , res , next)=>{
    const token =  req.cookies.token;

    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({message:"Unauthorized"});
    }


}



/**
 * GET / 
 * admin - LOGIN PAGE
 */

router.get("/admin" , async(req ,res )=>{
    try {
       const locals = {
            title :"Admin",
            description : "Simple blog created with nodejs and mongoodb"
        }
        res.render("admin/index" , {locals , layout: adminLayout})
    } catch (error) {
        console.log(error)
    }
})

/**
 * POST / 
 * admin - CHECK LOGIN 
 */

router.post("/admin" , async(req ,res)=> {
    try {

        const {username , password} = req.body;
        const user = await User.findOne({username});

        if(!user){
            return res.status(401).json({message : "Invalid credentials"});
        }
        const isPasswordValid = await bcrypt.compare(password , user.password);

        if(!isPasswordValid){
            return res.status(401).json({message : "Invalid credentials"});
        }



        const token = jwt.sign({userId : user._id} , process.env.JWT_SECRET);
        res.cookie('token' , token , {httpOnly : true});
        res.redirect('/dashboard');
       
    } catch (error) {
        console.log(error)
    }
})



/**
 * GET / 
 * admin - Dashboard
 */

router.get("/dashboard" , authMiddleware ,async(req ,res )=>{
    try {
        const locals = {
            title :"Dashboard",
            description : "Simple blog created with nodejs and mongoodb"
        }

        const data = await post.find();
        res.render('admin/dashboard' , {
            locals,
            data  ,
            layout: adminLayout
        });
    } catch (error) {
        
    }

})

/**
 * GET / 
 * admin - ADD
 */

router.get("/add-post" , authMiddleware ,async(req ,res )=>{
    try {
        const locals = {
            title :"Add post",
            description : "Simple blog created with nodejs and mongoodb"
        }

        const data = await post.find();
        res.render('admin/add-post' , {
            locals,
            layout : adminLayout
        });
    } catch (error) {
        
    }

})



/**
 * GET / 
 * admin - ADD
 */

router.get("/edit-post/:id" , authMiddleware ,async(req ,res )=>{
    try {
        const locals = {
            title :"Edit post",
            description : "Simple blog created with nodejs and mongoodb"
        }

        const data = await post.findOne({_id : req.params.id});


        res.render('admin/edit-post' , {
            locals,
            data,
            layout : adminLayout
        });
    } catch (error) {
        console.log(error)
    }

})
/**
 * PUT / 
 * admin - EDIT POST
 */

router.put("/edit-post/:id" , authMiddleware ,async(req ,res )=>{
    try {
        
        await post.findByIdAndUpdate(req.params.id ,{
            title : req.body.title,
            body:req.body.body,
            updatedAt : Date.now()
        } )

        res.redirect(`/edit-post/${req.params.id}`)

    } catch (error) {
        console.log(error)
    }

})
/**
 * DELETE / 
 * admin - DELETE POST
 */

router.delete("/delete-post/:id" , authMiddleware ,async(req ,res )=>{
    try {
        
        await post.deleteOne({_id :req.params.id})

        res.redirect(`/dashboard`)

    } catch (error) {
        console.log(error)
    }

})

/**
 * POST / 
 * admin - ADD
 */

router.post("/add-post" , authMiddleware ,async(req ,res )=>{
    try {
       try {
        const newPost = new post ({
            title : req.body.title,
            body : req.body.body
        })

        await post.create(newPost);
        res.redirect('/dashboard');

       } catch (error) {
        console.log(error)
       }
     
    } catch (error) {
        console.log(error)   
    }
    
})



/**
 * GET / 
 * admin - LOGOUT
 */

router.get("/logout"  ,(req ,res )=>{
    res.clearCookie('token');
    // res.json({message : "Logout successfull"})
    res.redirect("/")
})
module.exports = router;