const db = require("../../../../sequelize/models");

const exploreDataService = async (data) => {
  try {
    await db.Explore.create({ ...data });
    return {
      response: "Data Added Successfully",
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    console.log("error", error);
    return { response: error, statusCode: 400, error: true };
  }
};
const deleteExploreService = async (exploreId, userId) => {
  try {
    const dbResponse = await db.Explore.findOne({
      where: { id: exploreId, userId: userId },
    });
    if (dbResponse == null) {
      return {
        error: true,
        response: "Explore with this id is not found",
        statusCode: 400,
      };
    } else {
      await db.Explore.destroy({
        where: { id: exploreId },
      });
    }
    return {
      response: "Explore Deleted SuccessFully",
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    console.log("error", error);
    return { response: error, statusCode: 400, error: true };
  }
};

const getExploreByIdService = async (exploreId) => {
  try {
    const dbResponse = await db.Explore.findOne({
      where: { id: exploreId },
    });
    if (dbResponse === null) {
      return {
        response: "Explore With this Id is Not Found !",
        statusCode: 400,
        error: true,
      };
    } else {
      return { response: dbResponse.dataValues, statusCode: 200, error: false };
    }
  } catch (error) {
    return { response: error, statusCode: 400, error: true };
  }
};
const getExploreService = async (start, pageSize, uid) => {
  try {
    const dbResponse = await db.sequelize.query(
      `SELECT 
      e.*,
      c.*,
      json_build_object(
        'id', c."id",
        'uid', c."uid",
        'fullName', c."fullName",
        'email', c."email",
        'profileImageUrl', c."profileImageUrl",
        'status', c."accountStatus",
        'role', c."role"
    ) AS "creatorInfo",
      json_build_object(
          'id', tv."id",
          'uid', tv."uid",
          'exploreId', tv."exploreId",
          'videoPath', tv."videoPath",
          'coverImagePath', tv."coverImagePath",
          'localPath', tv."localPath"
      ) AS "trailerVideo",
      json_agg(
          json_build_object(
              'id', u."id",
              'title', u."title",
              'description', u."description",
              'unitNumber', u."unitNumber",
              'videos', (
                  SELECT 
                      json_agg(
                          json_build_object(
                              'id', v."id",
                              'caption', v."caption",
                              'videoNumber', v."videoNumber",
                              'title', v."title",
                              'exploreId', v."exploreId",
                              'videoDetails', v."videoDetails"
                          )
                      )
                  FROM "Videos" v
                  WHERE u."unitNumber" = v."unitNumber" AND e."docId" = v."exploreId"
              )
          )
      ) AS "units",
      CASE
      WHEN EXISTS (SELECT 1 FROM "Buyers" b WHERE b."exploreId" = e."docId" AND b."uid" = :uid) THEN true
      ELSE false
  END AS "owner"
  FROM "Explores" e
  LEFT JOIN "TrailerVideos" tv ON e."docId" = tv."exploreId"
  LEFT JOIN "Units" u ON e."docId" = u."exploreId"
  LEFT JOIN "Users" c ON e."uid" = c."uid"
  GROUP BY e."id", tv."id", c."id"
  LIMIT :limit OFFSET :offset`,
      {
        replacements: { limit: pageSize, offset: start , uid},
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return { response: dbResponse, statusCode: 200, error: false };
  } catch (error) {
    return { response: error, statusCode: 400, error: true };
  }
};

const updateExploreService = async (exploreId, userId, data) => {
  try {
    const dbResponse = await db.Explore.findOne({
      where: { id: exploreId, userId: userId },
    });
    if (dbResponse === null) {
      return {
        error: true,
        response: "Explore not found",
        statusCode: 400,
      };
    } else {
      await db.Explore.update(
        {
          collabType: data.collabType,
          fullName: data.fullName,
          profileImageUrl: data.profileImageUrl,
          username: data.username,
          connectedGroup: data.connectedGroup,
          exploreRating: data.exploreRating,
          isFree: data.isFree,
          description: data.description,
          title: data.title,
          price: data.price,
          totalReviewsCount: data.totalReviewsCount,
          location: data.location,
          exploreId: data.exploreId,
          categoryId: data.categoryId,
        },
        { where: { id: exploreId } }
      );
      return {
        response: "Explore updated successfully",
        statusCode: 200,
        error: false,
      };
    }
  } catch (error) {
    console.log("error", error);
    return { response: "error", statusCode: 400, error: true };
  }
};

const addNewTagService = async (exploreId, userId, newTag) => {
  try {
    const dbResponse = await db.Explore.findOne({
      where: { id: exploreId, userId: userId },
    });
    if (dbResponse === null) {
      return { response: "Explore not found", statusCode: 400, error: true };
    }
    let existingTags = dbResponse.dataValues.tags;
    if (existingTags.length > 0) {
      let isTagExist = existingTags[0].indexOf(newTag);
      console.log("istagExist", isTagExist);
      let updatedTags = [];
      if (isTagExist === -1) {
        updatedTags = existingTags[0].concat(newTag);
        await db.Explore.update(
          { tags: [updatedTags] },
          { where: { id: exploreId } }
        );
      } else {
        return { response: "Tag already exists", error: true, statusCode: 400 };
      }
    } else {
      existingTags.push(newTag);
      console.log("abc", existingTags);
      await db.Explore.update(
        {
          tags: [existingTags],
        },
        { where: { id: exploreId } }
      );
    }
    return {
      response: "Tags update succesfully",
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    return { response: "error", statusCode: 400, error: true };
  }
};
const removeTagService = async (exploreId, userId, oldTag) => {
  try {
    const dbResponse = await db.Explore.findOne({
      where: { id: exploreId, userId: userId },
    });
    let prevArray = dbResponse.dataValues.tags;
    console.log("prevArr", prevArray);
    const index = prevArray[0].indexOf(oldTag);
    console.log("index", index);
    let updatedArray = [];
    if (index !== -1) {
      updatedArray = prevArray[0]
        .slice(0, index)
        .concat(prevArray[0].slice(index + 1));
      console.log("updated Array", updatedArray);
      await db.Explore.update(
        {
          tags: [updatedArray],
        },
        { where: { id: exploreId } }
      );
      console.log(`Array after removing ${oldTag}: ${updatedArray}`);
    } else {
      return {
        response: `${oldTag} not found in Explore tags.`,
        statusCode: 400,
        error: true,
      };
    }

    return {
      response: "Tag removed successfully",
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    return { response: error, statusCode: 400, error: true };
  }
};
const updateTagService = async (userId, exploreId, tagToFind, newTag) => {
  try {
    const dbResponse = await db.Explore.findOne({
      where: { id: exploreId, userId: userId },
    });
    if (dbResponse === null) {
      return { response: "Explore not found !", statusCode: 400, error: true };
    }
    let prevArray = dbResponse.dataValues.tags;
    const index = prevArray[0].indexOf(tagToFind);
    if (index !== -1) {
      prevArray[index] = newTag;
      await db.Explore.update(
        {
          tags: [prevArray],
        },
        { where: { id: exploreId } }
      );
      return {
        response: "Tag Updated SuccessFully!",
        statusCode: 200,
        error: false,
      };
    } else {
      return { response: "Tag Not Found!", statusCode: 400, error: true };
    }
  } catch (error) {
    return { response: "error", statusCode: 400, error: true };
  }
};

module.exports = {
  exploreDataService: exploreDataService,
  deleteExploreService: deleteExploreService,
  getExploreByIdService: getExploreByIdService,
  getExploreService: getExploreService,
  updateExploreService: updateExploreService,
  addNewTagService: addNewTagService,
  removeTagService: removeTagService,
  updateTagService: updateTagService,
};
