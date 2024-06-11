const db = require("../../../../sequelize/models");
const categoryServices = async (data, userId) => {
  try {
    const dbResponse = await db.Category.create({
      name: data.name,
      userId: userId,
      description: data.description,
    }
    );
    return {
      response: dbResponse.dataValues,
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    console.log("&&&&&&&&&&&&&&&&&",error)
    return {
      response: error,
      statusCode: 400,
      error: true,
    };
  }
};

const fetchAllCategoryService = async (start, pageSize) => {
  try {
    const dbResponse = await db.Category.findAll({
      offset: start,
      limit: pageSize,
    });
    return { response: dbResponse, statusCode: 200, error: false };
  } catch (error) {
    return { response: error, statusCode: 400, error: true };
  }
};

const fetchCategoryByIdService = async (categoryId) => {
  try {
    const category = await db.Category.findByPk(categoryId);
    if (!category) {
      return {
        response: "Category not found",
        statusCode: 404,
        error: true,
      };
    }

    return {
      response: category,
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    console.log(error);
    return {
      response: error,
      statusCode: 500,
      error: true,
    };
  }
};

const deleteCategoryByIdService = async (categoryId,userId) => {
  console.log(typeof(categoryId),typeof(userId))
  try {
    const result = await db.Category.destroy({
      where: {
        id: categoryId,
        userId:userId
      },
    });

    if (result === 0) {
      return {
        response: "CategoryId not found",
        statusCode: 404,
        error: true,
      };
    }

    return {
      response: "Category deleted successfully",
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    console.log(error);
    return {
      response: error,
      statusCode: 500,
      error: true,
    };
  }
};

const updateCategoryByIdService = async (userId,categoryId, updatedCategoryData) => {
  try {
    const result = await db.Category.update(updatedCategoryData, {
      where: {
        id: categoryId,userId : updatedCategoryData.userId
      },
    });

    if (result[0] === 0) {
      return {
        response: "Category not found or could not be updated",
        statusCode: 404,
        error: true,
      };
    }

    return {
      response: "Category updated successfully",
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    console.log(error);
    return {
      response: error,
      statusCode: 500,
      error: true,
    };
  }
};

module.exports = {
  categoryServices: categoryServices,
  fetchAllCategoryService: fetchAllCategoryService,
  fetchCategoryByIdService: fetchCategoryByIdService,
  deleteCategoryByIdService: deleteCategoryByIdService,
  updateCategoryByIdService: updateCategoryByIdService,
};
