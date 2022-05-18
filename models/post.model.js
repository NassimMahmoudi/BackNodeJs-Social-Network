const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    titre: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    categorie: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    ville: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    delegation: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    picture: {
      type: [String],
      required: true,}, 
    is_accepted: {
      type: Boolean,
      required: false,},
    video: {
      type: String,
    },
    likers: {
      
    },
    comments: {
      type: [
        {
          commenterId:String,
          commenterPseudo: String,
          text: String,
          timestamp: Number,
        }
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('post', PostSchema);