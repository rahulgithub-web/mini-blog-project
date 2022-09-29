const express= require('express');
const router = express.Router(); 
const authorController = require("../controller/authorController");
const blogController = require("../controller/blogController");
const middleware = require('../middleware/auth')

let {createAuthor,loginAuthor} = authorController;
let {createBlog,getBlogs,updateBlog,deleteBlog,deleteByQuery} = blogController;
let {authenticate,authorize,authorizeByQuery} = middleware;

// ======> Create Author Api <=========
router.post('/authors', createAuthor);

// ======> Author Login Api <==========
router.post('/login', loginAuthor);

// ======> Create Blog Api <===========
router.post('/blogs', authenticate, createBlog);

// ======> Get Blogs Api <=============
router.get('/blogs',authenticate, getBlogs);

// ======> Update Blogs Api <==========
router.put('/blogs/:blogId',authenticate, authorize, updateBlog);

// ======> Delete Blogs Api <==========
router.delete('/blogs/:blogId',authenticate, authorize, deleteBlog);

// ======> Delete Blogs By Query Params <=======
router.delete('/blogs',authenticate, authorizeByQuery, deleteByQuery);

module.exports= router;