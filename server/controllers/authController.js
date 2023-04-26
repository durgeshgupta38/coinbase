const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError")

//jwt token 
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
// generic response function
const createSendToken = (user, statusCode, res) => {

  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true  //cross site attacks prevention
  };

  //securing cookie when in production
  if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie("jwt", token,cookieOptions );

  //Removed the password from the response
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//signUp middleware authentication
exports.signUp = catchAsync(async(req,res,next)=>{

    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    })

    createSendToken(newUser, 201, res);
    next();
})

//login middleware athentication
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) check if email and password exist

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400)); 
    //a new object of class AppError is created which will call the constructor automatically
  }

  //2) check if user exists and password is correct
  const user = await User.findOne({email:email}).select("+password");
  const passCondition = await user?.correctPassword(password,user.password)
  
  if(!user || !passCondition){
    console.log("true");
    return next(new AppError("Incorrect email or password",401));
  }

  //3) IF EVEYTHING IS okay token is sent to client
  createSendToken(user,200,res);
});
