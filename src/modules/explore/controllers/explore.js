const {
  exploreDataService,
  deleteExploreService,
  getExploreByIdService,
  getExploreService,
  updateExploreService,
  updateTagsService,
  addNewTagService,
  removeTagService,
  updateTagService,
} = require("../services/exploreServices");

const exploreData = async (req, res) => {
  const userId = req.user.userId;
  try {
    const { response, statusCode, error } = await exploreDataService(req.body);
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: "Error",
        data: response
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const deleteExplore = async (req, res) => {
  const userId = req.user.userId;
  const exploreId = req.params.id;
  try {
    const { response, statusCode, error } = await deleteExploreService(exploreId, userId);
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: "Error",
        data: response
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const getExploreById = async (req, res) => {
  const exploreId = req.params.id;
  try {
    const { response, statusCode, error } = await getExploreByIdService(exploreId);
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: "Error",
        data: response
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const getExplore = async (req, res) => {
  let pageSize = req.query.pSize ? Number(req.query.pSize) : 10;
  let start = req.query.page ? pageSize * (Number(req.query.page) - 1) : 0;
  const { uid } = req.user;
  try {
    const { response, statusCode, error } = await getExploreService(start, pageSize, uid);
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: "Error",
        data: null
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const updateExplore = async (req, res) => {
  const exploreId = req.params.id;
  const userId = req.user.userId;
  try {
    const { response, statusCode, error } = await updateExploreService(exploreId, userId, req.body);
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: "Error",
        data: response
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const addTags = async (req, res) => {
  const exploreId = req.params.id;
  const newTag = req.body.tag;
  const userId = req.user.userId;
  try {
    const { response, statusCode, error } = await addNewTagService(exploreId, userId, newTag);
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: "Error",
        data: response
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const removeTag = async (req, res) => {
  const userId = req.user.userId;
  const exploreId = req.params.id;
  const { oldTag } = req.body;
  try {
    const { response, statusCode, error } = await removeTagService(exploreId, userId, oldTag);
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: "Error",
        data: response
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const updateTag = async (req, res) => {
  const userId = req.user.userId;
  const exploreId = req.params.id;
  const { tagToFind, newTag } = req.body;
  try {
    const { response, statusCode, error } = await updateTagService(userId, exploreId, tagToFind, newTag);
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: "Error",
        data: response
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

module.exports = {
  exploreData: exploreData,
  deleteExplore: deleteExplore,
  getExploreById: getExploreById,
  getExplore: getExplore,
  updateExplore: updateExplore,
  addTags: addTags,
  removeTag: removeTag,
  updateTag: updateTag,
};
