const Post = require("../models/Post");
const { postValidation } = require("../middlewares/validation");
const config = require("../config/general.config");
const User = require("../models/User");

//get All posts
exports.getAllPost = async (req, res) => {
  var perPage = parseInt(req.query.perPage)
    ? parseInt(req.query.perPage)
    : config.listPerPage;
  var page = parseInt(req.query.pageNo) || 1;
  try {
    const posts = await Post.find().sort({ _id: -1 }).populate("author");
    return res
      .status(200)
      .send({ success: true, message: " get all posts", posts });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

//get All posts  by Author
exports.getAllPostByAuthor = async (req, res) => {
  var perPage = parseInt(req.query.perPage)
    ? parseInt(req.query.perPage)
    : config.listPerPage;
  var page = parseInt(req.query.pageNo) || 1;
  try {
    const posts = await Post.find({ author: req.params.id })
      .sort({ _id: -1 })
      .populate("author");
    return res
      .status(200)
      .send({ success: true, message: " Get all posts", data: posts });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

//find post by keyword or author
exports.getAllPostByKeywordOrAuthor = async (req, res) => {
  var perPage = parseInt(req.query.perPage)
    ? parseInt(req.query.perPage)
    : config.listPerPage;

  var page = parseInt(req.query.pageNo) || 1;

  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: `${req.body.title}.*` } },

        { content: { $regex: `${req.body.content}.*` } },

        // { author: req.body.author },
      ],
    })
      .sort({ _id: -1 })
      .populate("author");

    return res
      .status(200)
      .send({ success: true, message: "Get all posts", data: posts });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
// exports.getAllPostByKeywordOrAuthor = async (req, res) => {
//   var perPage = parseInt(req.query.perPage) ? parseInt(req.query.perPage) : config.listPerPage;
//   var page = parseInt(req.query.pageNo) || 1;
//   try {
//     // const posts = await Post.find({title: {$regex: `/${req.body.title}/i`}}).sort({_id: -1});
//     const posts = await Post.find().sort({_id: -1});
//   return res.status(200).send({ message: "Get all posts", data:posts });
//   } catch (error) {
//     res.status(500).json({'error':error});
//   }
// }

//create post
exports.createPost = async (req, res) => {
  const { error } = postValidation(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });

  const titleExist = await Post.findOne({ title: req.body.title }); //returns the first document that matches the query criteria or null
  if (titleExist)
    return res
      .status(500)
      .send({ success: false, message: "Title already exist!" });

  try {
    const savePost = await new Post(req.body);
    const savedPost = await savePost.save();
    res
      .status(200)
      .json({ success: true, message: "Added successfully", data: savedPost });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//update post
exports.updatePost = async (req, res) => {
  // const titleExist = await Post.findOne({
  //   _id: { $ne: req.params.id },
  //   title: req.body.title,
  // }); //returns the first document that matches the query criteria or null
  // if (titleExist)
  //   return res
  //     .status(500)
  //     .send({ success: false, message: "Title already exist!" });

  try {
    const post = await Post.findById(req.params.id);
    await Post.updateOne({ _id: req.params.id }, { $set: req.body });
    res
      .status(200)
      .json({ success: true, message: "it has been updated", data: post });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//delete post
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost)
      return res
        .status(500)
        .send({ success: false, message: "Could not delete user" });
    return res.status(200).send({
      success: true,
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: "An error has occurred, unable to delete post",
    });
  }
};

//get one post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Get successfully", data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
