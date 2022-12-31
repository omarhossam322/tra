const mongoose=require('mongoose');


const schema=mongoose.Schema;
const UserSchema= new schema({
  name:{type:String,unique:true,required:true},
  password:{type:String,required:true},
  wanttogo:{type:[]}
 
});

module.exports= mongoose.model('Users', UserSchema);
