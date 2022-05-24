const PostModel = require("../models/post.model.js");
const UserModel = require("../models/user.model.js");
const { uploadErrors } = require("../utils/errors.utils.js");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
var upload_video = require("./video_upload");
// Search Post
module.exports.SearchPost = async (req, res) => {
  let delegation = req.params.delegation;
  let ville = req.params.ville;
  let titre = req.params.titre;
  let categorie = req.params.categorie;
  let result=[];
  let search_result;
  console.log(req.params)
  if((categorie=="all")&&(ville=="all")&&(delegation=="all")){ 
    search_result = await PostModel.find().sort({createdAt : -1});
  }else if((categorie=="all")&&(delegation!="all")&&(ville!="all")){
    search_result = await PostModel.find({ $and:[{ delegation , ville }]}).sort({createdAt : -1});
  }else if((ville=="all")&&(delegation!="all")&&(categorie!="all")){
    search_result = await PostModel.find({$and:[{categorie, delegation}]}).sort({createdAt : -1});
  }else if((delegation=="all")&&(ville!="all")&&(categorie!="all")){
    search_result = await PostModel.find({$and:[{ categorie ,ville}]}).sort({createdAt : -1});
  }else if((delegation!="all")&&(ville=="all")&&(categorie=="all")){
    search_result = await PostModel.find({ delegation : delegation }).sort({createdAt : -1});
  }else if((ville!="all")&&(delegation=="all")&&(categorie=="all")){
    search_result = await PostModel.find({ ville : ville }).sort({createdAt : -1});
  }else if((categorie!="all")&&(delegation=="all")&&(ville=="all")){
    search_result = await PostModel.find({ categorie : categorie }).sort({createdAt : -1});
  }else{
    search_result = await PostModel.find({$and:[{ categorie , delegation , ville}]}).sort({createdAt : -1});
  }
  
  search_result.forEach(element => {
    let titre_post=element.titre;
    let position = titre_post.indexOf(titre);
    if(position>-1){
      result.push(element);
    }
  });

  res.status(200).send(result);
};
module.exports.readPost = (req, res) => {
  PostModel.findOne(req.params.id,(err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  });
};
module.exports.myPosts = (req, res) => {
  PostModel.find({posterId : req.params.id},(err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};
module.exports.readAllPosts = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};
module.exports.readAcceptedPosts = (req, res) => {
  PostModel.find({is_accepted : true},(err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};

module.exports.createPost = async (req, res) => {
  let pictures= [];
  req.files.forEach(element => {
        pictures.push(element.path)
  }); 
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    titre: req.body.titre,
    ville: req.body.ville,
    delegation: req.body.delegation,
    categorie: req.body.categorie,
    picture: pictures,
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    message: req.body.message,
    ville: req.body.ville,
    titre: req.body.titre,
    delegation: req.body.delegation,
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );
};
module.exports.acceptPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    is_accepted : true,
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );
};

module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Delete error : " + err);
  });
};

module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id_liker },
      },
      { new: true })
      .then((data) => console.log(data))
      .catch((err) => res.status(500).send({ message: err }));

    await UserModel.findByIdAndUpdate(
      req.body.id_liker,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id_liker },
      },
      { new: true })
            .then((data) => console.log(data))
            .catch((err) => res.status(500).send({ message: err }));

    await UserModel.findByIdAndUpdate(
      req.body.id_liker,
      {
        $pull: { likes: req.params.id },
      },
      { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.commentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.editCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findById(req.params.id, (err, docs) => {
      const theComment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );

      if (!theComment) return res.status(404).send("Comment not found");
      theComment.text = req.body.text;

      return docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(400).send(err);
    }
};
module.exports.UploadVideo = (req, res) => {
  let post = req.body.post;
  console.log(req.body.post)
  upload_video(req, async function(err, data) {
    console.log(req.body.post)
  if (err) {
  return res.status(404).send(JSON.stringify(err));
  }
  await PostModel.findOneAndUpdate({_id : post}, {video : data.link});
  console.log(data)
  res.send(data.link);
  });

};