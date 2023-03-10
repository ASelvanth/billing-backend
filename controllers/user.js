const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();
const SECRET = process.env.SECRET;
const HOST = process.env.SMTP_HOST;
const PORT = process.env.SMTP_PORT;
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;

const User = require('../models/UserModel');
const ProfileModel = require('../models/ProfileModel');

const signin = async (req, res) => {
  const { email, password } = req.body; //Coming from formData

  try {
    const existingUser = await User.findOne({ email });

    //get userprofile and append to login auth detail
    const userProfile = await ProfileModel.findOne({
      userId: existingUser?._id,
    });

    if (!existingUser)
      return res.status(404).json({ message: 'Invalid credentials' });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' });

    //If crednetials are valid, create a token for the user
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET,
      { expiresIn: '1h' }
    );

    //Then send the token to the client/frontend
    res.status(200).json({ result: existingUser, userProfile, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName, bio } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });
    const userProfile = await ProfileModel.findOne({
      userId: existingUser?._id,
    });

    if (existingUser)
      return res.status(400).json({ message: 'User already exist' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password don't match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      bio,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ result, userProfile, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const forgotPassword = (req, res) => {
  const { email } = req.body;

  // NODEMAILER TRANSPORT FOR SENDING POST NOTIFICATION VIA EMAIL
  const transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    auth: {
      user: USER,
      pass: PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: 'User does not exist in our database' });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user
        .save()
        .then((result) => {
          transporter.sendMail({
            to: user.email,
            from: 'Invoicy <hello@invoicy.com>',
            subject: 'Password reset request',
            html: `
                    <p>You requested for password reset from Arc Invoicing application</p>
                    <h5>Please click this <a href="https://invoicybilly.netlify.app/reset/${token}">link</a> to reset your password</h5>
                    <p>Link not clickable?, copy and paste the following url in your address bar.</p>
                    <p>https://invoicybilly.netlify.app/reset/${token}</p>
                    <P>If this was a mistake, just ignore this email and nothing will happen.</P>
                    `,
          });
          res.json({ message: 'check your email' });
        })
        .catch((err) => console.log(err));
    });
  });
};

const resetPassword = (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: 'Try again session expired' });
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({ message: 'password updated successfully' });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { signin ,signup , forgotPassword ,resetPassword}