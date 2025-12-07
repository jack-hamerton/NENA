const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'fullName');
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = new Post({ ...req.body, author: req.userId });
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const comment = new Comment({ ...req.body, author: req.userId, post: req.params.postId });
    await comment.save();
    await Post.findByIdAndUpdate(req.params.postId, { $push: { comments: comment._id } });
    res.status(201).send(comment);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
