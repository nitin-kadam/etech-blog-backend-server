const express = require('express');
const PostController = require('../controllers/PostController');
const { verifyUser } = require('../middlewares/VerifyToken');

const router = express.Router();
const app = express()



router.get("/", PostController.getAllPost);
router.post("/create", verifyUser, PostController.createPost);
router.put("/update/:id", verifyUser, PostController.updatePost);
router.delete("/delete/:id",verifyUser, PostController.deletePost);
router.get("/getAllPostByAuthor/:id", verifyUser,PostController.getAllPostByAuthor);
router.get("/getPostById/:id", verifyUser,PostController.getPost);
router.post("/getAllPostByKeywordOrAuthor",PostController.getAllPostByKeywordOrAuthor);


module.exports = router;