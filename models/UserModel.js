const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  expireToken: Date,
});

module.exports = mongoose.model('User', userSchema);

// const User = mongoose.model('User', userSchema);
// export default User;
// // const Schema = mongoose.Schema;

// //schema definitions
// const profileSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim : true
//     },
//     email: {
//         type: String,
//         unique: true,
//         required: true,
//         trim : true,
//     },
//     mobileNumber :{
//         type : String,
//         required : true,
//         unique: true,
//         trim : true
//     },
//     businessName: {
//         type: String,
//         trim : true,
//         unique : true
//     },
//     address: {
//         type: String,
//         required: true
//     },
//     website :{
//         type : String,
//         trim : true
//     },
//     userId : [String],
// },{ timestamps: true }); 


// //model creation
// module.exports = mongoose.model('Profiles',profileSchema);