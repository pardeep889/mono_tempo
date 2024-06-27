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

module.exports = {
  adminFetchCountService: adminFetchCountService,
};
