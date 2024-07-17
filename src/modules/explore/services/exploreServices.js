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
const getExploreService = async (start, pageSize, uid, locationFilterType, locationFilterName, category, latitude, longitude, promoted) => {
  console.log("incoming filters: ", locationFilterType, locationFilterName, category, latitude, longitude, promoted);

  let categoryCondition = "";
  let locationCondition = "";
  let promotedCondition = "";

  if (category) {
    categoryCondition = `AND e."categoryID" = :category `;
  }

  if (locationFilterType && locationFilterName) {
    if (locationFilterType === 'country') {
      locationCondition += `AND e."location"->'country'->>'name' = :locationFilterName `;
    } else if (locationFilterType === 'city') {
      locationCondition += `AND e."location"->'city'->>'name' = :locationFilterName `;
    } else if (locationFilterType === 'venue') {
      locationCondition += `AND e."location"->'venue' = :locationFilterName `;
    }
  }

  if (latitude && longitude) {
    locationCondition += `AND (e."location"->'location'->>'latitude')::numeric = :latitude `;
    locationCondition += `AND (e."location"->'location'->>'longitude')::numeric = :longitude `;
  }

  if (promoted !== undefined) {
    promotedCondition = `AND e."promoted" = :promoted `;
  }

  try {
    const dbResponse = await db.sequelize.query(
      `SELECT 
        e.*,
        e.id as exploreId,
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
        END AS "owner",
        e."location"::json AS "location"  -- Properly handle the location column as JSON
      FROM "Explores" e
      LEFT JOIN "TrailerVideos" tv ON e."docId" = tv."exploreId"
      LEFT JOIN "Units" u ON e."docId" = u."exploreId"
      LEFT JOIN "Users" c ON e."uid" = c."uid"
      WHERE 1=1 ${categoryCondition} ${locationCondition} ${promotedCondition}
      GROUP BY e."id", tv."id", c."id"
      LIMIT :limit OFFSET :offset`,
      {
        replacements: { limit: pageSize, offset: start, uid, category, locationFilterName, latitude, longitude, promoted },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return { response: dbResponse, statusCode: 200, error: false };
  } catch (error) {
    console.log(error);
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
const addNewTagService = async (exploreId, uid, newTag) => {
  try {
    const dbResponse = await db.Explore.findOne({
      where: { id: exploreId, uid: uid },
    });
    if (dbResponse === null) {
      return { response: "Explore not found", statusCode: 400, error: true };
    }

    let existingTags = dbResponse.dataValues.tags || [];

    if (existingTags.includes(newTag)) {
      return { response: "Tag already exists", statusCode: 400, error: true };
    }

    existingTags.push(newTag);

    await db.Explore.update(
      { tags: existingTags },
      { where: { id: exploreId } }
    );

    return {
      response: newTag,
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    console.error("Error adding new tag:", error);
    return { response: "An error occurred while adding the new tag.", statusCode: 500, error: true };
  }
};
const removeTagService = async (exploreId, uid, oldTag) => {
  try {
    const explore = await db.Explore.findOne({
      where: { id: exploreId, uid: uid },
    });

    if (!explore) {
      return { response: "Explore not found", statusCode: 400, error: true };
    }

    let tags = explore.tags || [];

    const index = tags.indexOf(oldTag);
    if (index !== -1) {
      tags.splice(index, 1); // Remove the tag from array

      await db.Explore.update(
        { tags: tags },
        { where: { id: exploreId } }
      );

      console.log(`Tag '${oldTag}' removed successfully. Updated tags:`, tags);

      return {
        response: oldTag,
        statusCode: 200,
        error: false,
      };
    } else {
      return {
        response: `${oldTag} not found in Explore tags.`,
        statusCode: 400,
        error: true,
      };
    }
  } catch (error) {
    console.error("Error removing tag:", error);
    return { response: "An error occurred while removing the tag.", statusCode: 500, error: true };
  }
};

const updateTagService = async (uid, exploreId, tagToFind, newTag) => {
  console.log(uid, exploreId, tagToFind, newTag);
  try {
    const dbResponse = await db.Explore.findOne({
      where: { id: exploreId , uid: uid },
    });

    if (dbResponse === null) {
      return { response: "Explore not found!", statusCode: 400, error: true };
    }

    let prevArray = dbResponse.dataValues.tags || [];
    const index = prevArray.indexOf(tagToFind);

    if (index !== -1) {
      prevArray[index] = newTag;

      await db.Explore.update(
        { tags: prevArray },
        { where: { id: exploreId } }
      );

      return {
        response: newTag,
        statusCode: 200,
        error: false,
      };
    } else {
      return { response: "Tag Not Found!", statusCode: 400, error: true };
    }
  } catch (error) {
    console.error("Error updating tag:", error);
    return { response: "An error occurred while updating the tag.", statusCode: 500, error: true };
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
