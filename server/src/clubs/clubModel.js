'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClubSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  text: {
    type: String,
    default: '',
    trim: true
  },
  image: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Club', ClubSchema);
