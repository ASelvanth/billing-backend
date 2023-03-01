const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     productName: {
//         type: String,
//         required: true,
//         trim : true
//     },
//     productImage: {
//         type: String,
//         required: true,
//         trim : true
//     },
//     productDetails: {
//         type: String,
//         required: true,
//         trim : true
//     },
//     productPrice: {
//         type: String,
//         required: true,
//         trim : true
//     },
//     productReviews: {
//         type: String,
//         required: true
//     },
//     productQty: {
//         type: String,
//         required: true
//     }
// });

// //Model creation
// module.exports = mongoose.model('Products', productSchema);

// import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phoneNumber: String,
  businessName: String,
  contactAddress: String,
  paymentDetails: String,
  logo: String,
  website: String,
  userId: [String],
});

module.exports = mongoose.model('Profile', profileSchema);

// const Profile = mongoose.model('Profile', profileSchema);
// export default Profile;