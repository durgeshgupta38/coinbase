//function to catch errors in async function
module.exports = (fn) =>{
    return (req,res,next) =>{
        fn(req, res, next).catch(err => next(err));
    }
}