const blog = require("../models/blogModel");
const author = require("../models/authorModel");

// =================> CREATE BLOGS <====================

const createBlog = async function (req, res) {
  try {
    let getBlogData = req.body;
    if (Object.keys(getBlogData).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Data is required to create a blog" });

    // checking that the below data is present or not
    let { title, body, authorId, category } = getBlogData;
    if (!title)
      return res
        .status(400)
        .send({ status: false, msg: "Title must be filled" });
    if (!body)
      return res
        .status(400)
        .send({ status: false, msg: "Body must be filled" });
    if (!category)
      return res
        .status(400)
        .send({ status: false, msg: "Category must be present" });

    let getAuthorData = await author.findById(getBlogData.authorId);
    console.log(authorId);
    if (getAuthorData == 0)
      return res.status(400).send({ status: false, msg: "Mising authorId" });
    if (!getAuthorData)
      return res.status(404).send({
        status: false,
        msg: "No such author exists please provide authorId",
      });
    let savedBlogData = await blog.create(getBlogData);
    res.status(201).send({
      status: true,
      data: savedBlogData,
      msg: "Blog has been created successfully",
    });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// =================> GET BLOGS <=======================

const getBlogs = async (req, res) => {
  try {
    let data = req.query;

    let getBlogs = await blog.find({
      $and: [
        { $and: [{ isDeleted: false }, { isPublished: true }] },
        {
          $or: [
            { authorId: { $in: data.authorId } },
            { category: { $in: [data.category] } },
            { tags: { $in: [data.tags] } },
            { subCategory: { $in: [data.subCategory] } },
          ],
        },
      ],
    });

    if (getBlogs.length == 0)
      return res.status(200).send({ status: true, msg: "No such blog exist" });
    res.status(200).send({
      status: true,
      data: getBlogs,
      msg: "Blogs data are re filtered successfully",
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

// ===============> Update Blogs <==================

const updatedBlogs = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let { title, body, tags, subCategory } = req.body;
    const date = Date.now();

    if (!blogId)
      return res.status(404).send({
        status: false,
        msg: "Blog Is Not Found , Please Enter Valid Blog Id",
      });

    if (Object.keys(req.body).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Body Must be filled" });
    if (title == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Value of the title must be present" });
    if (body == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Value of the body must be present" });
    if (tags == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Value of the tags must be present" });
    if (subCategory == 0)
      return res.status(400).send({
        status: false,
        msg: "Value of the subCategory must be present",
      });
    let updateQuery = {
      title: title,
      body: body,
    };

    let addQuery = { tags: tags, subCategory: subCategory };
    const allBlogs = await blog.findOne({
      $and: [{ isDeleted: false }, { isPublished: true }],
    });
    if (!allBlogs)
      return res
        .status(404)
        .send({ status: false, msg: "No filter possible are available" });
    console.log(allBlogs);

    // WE ARE FINDING ONE BY BLOG ID AND UPDATING //
    let updatedblog = await blog.findOneAndUpdate(
      { _id: blogId },
      { $set: updateQuery, $push: addQuery, publishedAt: date },
      { new: true }
    );
    console.log(updatedblog);
    res.status(200).send({
      status: true,
      msg: "Blog is Updated Successfully",
      data: updatedblog,
    });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// ==============> Delete Blog <=======================

const deletedBlog = async function (req, res) {
  try {
    let blogid = req.params.blogId;
    let findData = await blog.findById(blogid);
    if (!findData)
      return res
        .status(404)
        .send({ status: false, message: "no such blog exists" });
    if (findData.isDeleted)
      return res
        .status(404)
        .send({ status: false, msg: "Blog is already deleted" });
    let deletedata = await blog.findOneAndUpdate(
      { _id: blogid },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    res.status(200).send({
      status: true,
      data: deletedata,
      msg: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

// ============> Delete Blogs with query params <==========
const deleteBlogByParams = async function (req, res) {
   try {

      let getobject = req.query

      let updateData = await blog.updateMany(
         { $and: [{ authorId: req.body.tokenId }, { isDeleted: false }, getobject] }, { $set: { isDeleted: true, deletedAt: Date.now() } },
         { new: true })

      if (!updateData.modifiedCount)

         return res.staus(400).send({ status: false, msg: "no such blog" })

      res.status(200).send({ status: true, msg: "numbers of delated blog= " + updateData.modifiedCount })
   }
   catch (err) {
      res.status(500).send({ status: false, msg: err.message })
   }
}

module.exports.getBlogs = getBlogs;
module.exports.deletedBlog = deletedBlog;
module.exports.createBlog = createBlog;
module.exports.updatedBlogs = updatedBlogs;
module.exports.deletedByQueryParams = deletedByQueryParams;
