const passport = require('passport');
const localStrategy = require('passport-local').Strategy ;
const person = require('./models/person') ;
//verification function 
passport.use(new localStrategy(async(USERNAME ,password , done)=>{
    //authentication function 
    try {
       // we should not stroe password as it is 
     // console.log('Received Credentials :',USERNAME ,password) ;
      const user = await  person.findOne({username:USERNAME}) ;
      if(!user){
        return done(null,false,{message:'Incorrect username'});
      }
      const ispasswordMatch =  await user.comparePassword(password) ;
      if(ispasswordMatch){
        return done(null,user);
      } 
      else 
        return done(null,false,{message:'Incorrect password'}) ;
    } catch (error) {
      return done(error) ;
    }
})
);

module.exports = passport ; // export