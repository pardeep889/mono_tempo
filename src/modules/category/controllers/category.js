const {
  categoryServices,
  fetchAllCategoryService,
  fetchCategoryByIdService,
  deleteCategoryByIdService,
  updateCategoryByIdService,
} = require("../services/categoryServices");
const db = require("../../../../sequelize/models/category");

const createCategory = async (req, res) => {
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId =loggedInUser.userId;
    const { response, statusCode, error } = await categoryServices(req.body,userId);
    console.log("errorrrrr",error)
    try {
      if (error) return res.status(statusCode).send(response);
      return res.status(statusCode).send(response);
    } catch (error) {
      console.log("*********",error)
      return res.status(400).json("error");
    }
};
const fetchAllCategory = async (req, res) => {
  let pageSize = req.query.pSize ? Number(req.query.pSize) : 10;
  let start = req.query.page ? pageSize * (Number(req.query.page) - 1) : 0;
  const { response, statusCode, error } = await fetchAllCategoryService(
    start,
    pageSize
  );
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error");
  }
};
const fetchCategoryById = async (req, res) => {
  const categoryId = req.params.categoryId;
  const { response, statusCode, error } = await fetchCategoryByIdService(
    categoryId
  );
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error");
  }
};
const deleteCategory = async (req, res) => {
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId = loggedInUser.userId;
  const categoryId = req.params.categoryId;
  const { response, statusCode, error } = await deleteCategoryByIdService(categoryId,userId);
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    console.log("Error:", error);
    return res.status(400).json("error");
  }
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId =loggedInUser.userId;
  const updatedCategoryData ={...req.body,userId}
    const { response, statusCode, error } = await updateCategoryByIdService(userId,
      categoryId,
      updatedCategoryData
    );
    try {
      if (error) return res.status(statusCode).send(response);
      return res.status(statusCode).send(response);
    } catch (error) {
      return res.status(400).json("error");
    }
};

module.exports = {
  createCategory: createCategory,
  fetchAllCategory: fetchAllCategory,
  fetchCategoryById: fetchCategoryById,
  deleteCategory: deleteCategory,
  updateCategory: updateCategory,
};
