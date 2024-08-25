const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
  });

const AdminDB = mongoose.model('admin',adminSchema)
module.exports = AdminDB;