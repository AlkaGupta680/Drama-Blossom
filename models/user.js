const  mongoose = require("mongoose");
 const bcrypt = require('bcrypt') ;

//define personSchema 
const userSchema =  new mongoose.Schema({
     username:{
        type:String,
        required:true ,
        unique :true ,
        trim: true // Optional: Trims whitespace from the username
     },
     email:{
        type:String,
        required:true ,
        unique :true ,
        lowercase:true,
        trim: true, // Optional: Trims whitespace from the email
        match: [/.+@.+\..+/, 'Please fill a valid email address'] // Optional: Email format validation
     },
     profilePicture:{
        type:String,
        default: 'default-profile-pic.png'
     },
     createdAt:{
        type:Date, 
     default: Date.now
     },
     password:{
        type:String ,
        required:true,
        minlength: 6 // Optional: Minimum length for the password
     }

});

userSchema.pre('save' , async function(next){
    const user = this ;
    //hash the password only if it has been modified(or is new)
    if(!user.isModified('password')) return next() ;
    try {
       //hash password  generation 
       const salt = await bcrypt.genSalt(10) ;
       //hash passwrod
       const hashedPassword = await bcrypt.hash(user.password , salt) ;
       
       //override the plain  password with hashed  one  
       user.password = hashedPassword ;
       next() ;
    } catch (error) {
        return next(error) ; 
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try {
        const isMatch = await  bcrypt.compare(candidatePassword, this.password) ;
        return isMatch ;
    } catch (error) {
        throw error ;
    }
}

//create person schema 
const user = mongoose.model('user' , userSchema) ;
module.exports = user ; 