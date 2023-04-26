const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required : [true,"A name is required"],
    },
    email: {
        type: String,
        required : [true, "An email is required"],
        unique:true,
        validator: [validator.isEmail,"Please provide a valid email"],
    },
    password :{
      type:String,
      required:[true,"A password is required"],
      minLength: 8,
      select : false  //you cannot have access to it inside the method unless you specifically override that setting.
    },
    passwordConfirm:{
        type:String,
        required : [true,"Please confirm your password"],
        validate :{
            validator : function(elem){
                return elem === this.password
            },
            message:"Password are not same"
        }
    },

})

//middleware to encrypt the password
userSchema.pre("save",async function(next){
    //only run this function when password is modified
    if(!this.isModified("password")) return next();

    //hash the password with cost of 12
    this.password = await bcrypt.hash(this.password,12);

    //delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
})

//method to compare the password from db
userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

const User = mongoose.model("User",userSchema);
module.exports = User;