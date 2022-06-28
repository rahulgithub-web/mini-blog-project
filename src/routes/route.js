const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogsController");
const middleware = require("../middlewares/auth")

let { authentication, authorization } = middleware;
let { createBlog, getBlogs, updatedBlogs, deletedBlog, deletedByQueryParams } = blogController;
let { createAuthor, loginAuthor } = authorController;

// ---------- Create Author Api ---------
router.post("/authors", createAuthor);

// ---------- Login Author Api -----------
router.post("/login", loginAuthor);

// ---------- Create Blog Api ------------ 
router.post("/blogs", authentication, createBlog);

// ---------- Get Blogs Api -------------
router.get("/blogs" , authentication ,getBlogs);

// -------- Get Updated Blogs using blogId ------
router.put("/blogs/:blogId", authentication, authorization, updatedBlogs);

// ---------- Delete Api ---------------
router.delete("/blogs/:blogId", authentication, authorization, deletedBlog);

// ---------- Delete Blogs By Query ----------
router.delete("/blogs", authentication, authorization, deletedByQueryParams);

// ----------------------------------- 
module.exports = router;
