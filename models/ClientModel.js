// import express from 'express';
// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const express = require('express');


const ClientSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  userId: [String],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('ClientModel', ClientSchema);


// const ClientModel = mongoose.model('ClientModel', ClientSchema);
// export default ClientModel;