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
  const loggedInUser= JSON.parse(req.headers['x-logged-in-user']);
    const userId = loggedInUser.userId;
    const { response, statusCode, error } = await exploreDataService(req.body);
    try {
      if (error) return res.status(statusCode).send(response);
      return res.status(statusCode).send(response);
    } catch (error) {
      return res.status(400).json("error");
    }
};

const deleteExplore = async (req, res) => {
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
    const userId = loggedInUser.userId;
    const exploreId = req.params.id;
  const { response, statusCode, error } = await deleteExploreService(exploreId,userId);
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error");
  }
};

const getExploreById = async (req, res) => {
    const exploreId = req.params.id;
    const { response, statusCode, error } = await getExploreByIdService(exploreId);
    try {
      if (error) return res.status(statusCode).send(response);
      return res.status(statusCode).send(response);
    } catch (error) {
      return res.status(400).json("error");
    }
};
const getExplore = async (req, res) => {
  let pageSize = req.query.pSize ? Number(req.query.pSize) : 10;
  let start = req.query.page ? pageSize * (Number(req.query.page) - 1) : 0;
  const { response, statusCode, error } = await getExploreService(
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
const updateExplore = async (req, res) => {
  const exploreId = req.params.id;
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
    const userId = loggedInUser.userId;
    const { response, statusCode, error } = await updateExploreService(
      exploreId,
      userId,
      req.body
    );
    try {
      if (error) return res.status(statusCode).send(response);
      return res.status(statusCode).send(response);
    } catch (error) {
      return res.status(400).json("error");
    }
};

const addTags = async (req, res) => {
  const exploreId = req.params.id;
  const newTag = req.body.tag;
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
    const userId = loggedInUser.userId;
    const { response, statusCode, error } = await addNewTagService(
      exploreId,
      userId,
      newTag
    );
    try {
      if (error) return res.status(statusCode).send(response);
      return res.status(statusCode).send(response);
    } catch (error) {
      return res.status(400).json(error);
    }
};
const removeTag = async (req, res) => {
  const loggedInUser = JSON.parse(req.headers['x-logged-in-user']);
    const userId = loggedInUser.userId;
  const exploreId = req.params.id;
  const { oldTag } = req.body;
  const { response, statusCode, error } = await removeTagService(exploreId,userId,oldTag);
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const updateTag = async (req, res) => {
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
    const userId = loggedInUser.userId; 
    const exploreId = req.params.id;
    const { tagToFind, newTag } = req.body;
    const { response, statusCode, error } = await updateTagService(
      userId,
      exploreId,
      tagToFind,
      newTag
    );
    try {
      if (error) return res.status(statusCode).send(response);
      return res.status(statusCode).send(response);
    } catch (error) {
      return res.status(400).json(error);
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
