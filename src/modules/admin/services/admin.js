const db = require("../../../../sequelize/models");

async function adminFetchCountService() {
  try {
    const importedUsers = await db.User.count({ where: { userStatus: "null" } });
    const adminUsers = await db.User.count({ where: { role: "ADMIN" } });
    const normalUsers = await db.User.count({ where: { role: "USER" } });

    const finalData = {
        importedUsers,
        adminUsers,
        normalUsers
    };

    return { response: finalData, statusCode: 200, error: false, success: true };
  } catch (error) {
    console.error("Error fetching user counts:", error);
    return { response: "Error fetching user counts", statusCode: 500, error: true, success: false };
  }
}

async function FetchAllUsers(start, pageSize, role) {
  start = start || 0;
  pageSize = pageSize || 10;
  role = role || 'USER'

  console.log(start, pageSize, role)
  try {
    const users = await db.User.findAll({
      where: { role: role },
      limit: pageSize,
      offset: start,
    });

    return { response: users, statusCode: 200, error: false, success: true };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { response: "Error fetching users", statusCode: 500, error: true, success: false };
  }
}

async function promoteExplore(id, promote) {
  try {
    // Find the Explore entry by id
    const explore = await db.Explore.findOne({ where: { id } });

    if (!explore) {
      return { response: "Explore not found for the given id", statusCode: 404, error: true };
    }

    // Update the 'promoted' field according to the 'promote' parameter
    explore.promoted = promote;

    // Save the updated Explore entry
    await explore.save();

    return { response: "Explore promoted status updated successfully", statusCode: 200, error: false };
  } catch (error) {
    console.error("Error promoting explore:", error);
    return { response: "Error promoting explore", statusCode: 500, error: true };
  }
}


module.exports = {
  adminFetchCountService: adminFetchCountService,
  FetchAllUsers: FetchAllUsers,
  promoteExplore: promoteExplore
};
