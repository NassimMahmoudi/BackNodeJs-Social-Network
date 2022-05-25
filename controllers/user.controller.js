const UserModel = require("../models/user.model.js");
const PostModel = require("../models/post.model.js");
const ObjectID = require("mongoose").Types.ObjectId;
var fs =require('fs');

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};
module.exports.SearchUsers = async (req, res) => {
  let name_serached = req.params.name;
  let resultSearch=[];
  const users = await UserModel.find().select("-password");
  if(users){
    users.forEach(element => {
      let name=element.pseudo;
      let position = name.indexOf(name_serached);
      if(position>-1){
        resultSearch.push(element);
      }
    });
  }
  
  res.status(200).json(resultSearch);
};
module.exports.userHome = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  let resultSearch=[];
  let posts=[];
  const user = await UserModel.findById({_id : req.params.id}).select("-password");
  if(user){
      for (let element of user.following) {
      posts = await PostModel.find({posterId : element, is_accepted : true});
      
        for (let element of posts) {
        resultSearch.push(element)
      }
    }
  }
  res.status(200).json(resultSearch);
};

module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select("-password");
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          pseudo: req.body.pseudo,
          email: req.body.email,
          password: req.body.password,
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true })
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { 
        $addToSet: { following: req.body.idToFollow },
      },
      { new: true })
            .then((data) => console.log(data))
            .catch((err) => res.status(500).send({ message: err }));

      // add to following list
      await UserModel.findByIdAndUpdate(
        req.body.idToFollow,
        { 
          $addToSet: { followers: req.params.id },
         },
        { new: true })
          .then((data) => res.send(data))
          .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { 
        $pull: { following: req.body.idToUnfollow },
      },
      { new: true })
        .then((data) => console.log(data))
        .catch((err) => res.status(500).send({ message: err }));

      // Retirer de la liste des followers
      await UserModel.findByIdAndUpdate(
        req.body.idToUnfollow,
        { 
          $pull: { followers: req.params.id },
         },
        { new: true})
          .then((data) => res.send(data))
          .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
}
module.exports.acceptUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    is_verified : true,
  };

  UserModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );
};


module.exports.uploadProfil = (req, res) => {
  let new_image;
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  if(req.file){ 
    new_image=req.file.filename;
  try{
      // Delete old Image from server
      // IN the front side you should pass the new image and the old image too
      fs.unlinkSync("./uploads/profils/"+ req.body.old_image);//old_image in the front side must be a string from client.image 
  }catch(err){
      console.log(err);
  }
  const updatedRecord = {
    picture : new_image,
  };

  UserModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );}else{
    res.status(200).json({ message : 'You must select a new Image' });
  }
};


