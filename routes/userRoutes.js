const express=require('express') ;
const router = express.Router();
const user = require('./../models/user');
const {jwtMiddleware,generateToken}= require('../configure/jwt');


// below are end points and API are PUT,GET,POST,DELETE(CRUD)

// User sign-up
router.post('/signup' , async(req,res)=>{
    try {
     const data = req.body ;
     const newUser = new user(data) ;
     //save new user to database 
     const response = await newUser.save() ;
     console.log("data saved") ; 
       //payload 
       const payload = {
        id:response.id ,
        username: response.username
       }
       console.log(JSON.stringify(payload)) ;
       
       const token = generateToken(payload) ;
       console.log('Token saved is : ' , token)
     res.status(201).json({response:response , token : token}) ;
    } 
    catch (err) {
      console.log(err) ;
      res.status(500).json({error:'internal server error'}) ;
    }
 })


 //GET METHOD to get user detail  
  router.get('/' ,jwtMiddleware, async(req,res)=>{
   try {
      const data = await user.find() ;
      console.log("data fetched sucessfuly") ;
     res.status(200).json(data) ;
   } catch (err) {
     console.log(err) ;
      res.status(500).json({error:'internal server error'}) ;
   }
  })

//User login using email and password 
router.post('/login' ,async(req,res)=>{
  try {
    //extract username and password 
    const{username,password} = req.body ;
    //find user 
    const user = await user.findOne({username:username}) ;
    //if user do not exit or password is incorrect 
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error:'Invalid username or password'})
    }
    //generate token 
    const payload ={
      id:user.id ,
      username:user.username 
    }
    const token = generateToken(payload)
    //return token as response 
    res.json({token})
  } catch (err) {
    console.log(err) ;
    res.status(500).json({error:'internal server error'})
  }
}) ; 

//Get user profile information (requires authentication)
router.get('/profile',jwtMiddleware , async(req,res)=>{
   try {
     const userData = req.user ;
     console.log("user data :" , userData) 
     const userId = userData.id ;
     const  user =  await user.findById(userId) ;

     res.status(200).json({user}) ;

   } catch (err) {
    console.log(err) ;
    res.status(500).json({error:'internal server error'})
   }
})

  // parameterised API FOR USER DATABASE
router.get('/:workType' , async(req,res)=>{
    try {
       const workType = req.params.workType ;
       if(workType=='chef'||workType=='waiter'||workType=='manager'){
      const response = await user.find({work:workType}) ;
      console.log(" response fetched")
      res.status(200).json(response) ;
       }
      else{
        res.status(404).json({error:'invalid workType'}) ;
      }
  
    } catch (err) {
      console.log(err) ;
      res.status(500).json({error:"internal server error"})
      
    }
  });

//Update user profile information (requires authentication)
router.put('/:id',async(req,res)=>{
  try {
    const userId = req.params.id ;//extract the id from  URL paramter 
    const updateUserData = req.body ;// update data for the user 
    const response = await user.findByIdAndUpdate(userId , updateUserData,{
      new:true ,// return data updated document
      runValidators:true // run mongoose validation(condition)
    })
    if(!response){
      return res.status(404).json({error:'user not found'}) ;
    }
    console.log(" data updated")
      res.status(200).json(response) ;

  } catch (err) {
    console.log(err) ;
      res.status(500).json({error:"internal server error"})
  }
})

// delete
router.delete('/:id' ,async(req,res)=>{
  try {
    const userId = req.params.id ; // extract user id 
    const response = await user.findByIdAndDelete(userId) // delete userid
    if(!response){
      return res.status(404).json({error:'user not found'}) ;
    }
    console.log(" data deleted")
      res.status(200).json({message:'user deleted sucessfuly'}) ;
  } catch (err) {
    console.log(err) ;
      res.status(500).json({error:"internal server error"})
  }
})

//module export  this is very imp step 
  module.exports = router ;