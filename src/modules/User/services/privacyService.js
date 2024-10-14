const { Op } = require("sequelize");
const db = require("../../../../sequelize/models");

const getUserPrivacySettingsService = async (userId) => {
  try {
    const privacySettings = await db.UserPrivacySettings.findOne({
      where: { userId },
    });

    if (!privacySettings) {
      return {
        message: "Privacy settings not found",
        statusCode: 404,
        success: false,
        data: null,
      };
    }

    return {
      message: "Privacy settings fetched successfully",
      statusCode: 200,
      success: true,
      data: privacySettings,
    };
  } catch (error) {
    console.error("Error fetching privacy settings:", error);
    return {
      message: "Internal server error",
      statusCode: 500,
      success: false,
      data: null,
    };
  }
};

const updateUserPrivacySettingsService = async (userId, settingsToUpdate) => {
    try {
      // Fetch the current privacy settings for the user
      let privacySettings = await db.UserPrivacySettings.findOne({
        where: { userId },
      });
  
      // If the privacy settings don't exist, create them
      if (!privacySettings) {
        privacySettings = await db.UserPrivacySettings.create({
          userId,
          ...settingsToUpdate, // Spread the settings to update
        });
  
        return {
          message: "Privacy settings created successfully",
          statusCode: 201,
          success: true,
          data: privacySettings,
        };
      }
  
      // Update the privacy settings with new values
      await privacySettings.update(settingsToUpdate);
  
      return {
        message: "Privacy settings updated successfully",
        statusCode: 200,
        success: true,
        data: privacySettings,
      };
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      return {
        message: "Internal server error",
        statusCode: 500,
        success: false,
        data: null,
      };
    }
  };
  const blockUserService = async (userId, blockUserId) => {
    try {
      const privacySettings = await db.UserPrivacySettings.findOne({ where: { userId } });
      
      if (!privacySettings) {
        return { message: "Privacy settings not found", statusCode: 404, success: false, data: null };
      }
  
      if (privacySettings.blockedUsers && privacySettings.blockedUsers.includes(blockUserId)) {
        return { message: "User is already blocked", statusCode: 400, success: false, data: null };
      }
  
      privacySettings.blockedUsers = [...(privacySettings.blockedUsers || []), blockUserId]; // Add to blockedUsers array
      await privacySettings.save();
  
      return { message: "User blocked successfully", statusCode: 200, success: true, data: null };
    } catch (error) {
      console.error("Error blocking user:", error);
      return { message: "Internal server error", statusCode: 500, success: false, data: null };
    }
  };
  const unblockUserService = async (userId, unblockUserId) => {
    try {
      const privacySettings = await db.UserPrivacySettings.findOne({ where: { userId } });
  
      if (!privacySettings) {
        return { message: "Privacy settings not found", statusCode: 404, success: false, data: null };
      }
  
      const blockedUsers = privacySettings.blockedUsers || []; // Ensure it's an array
      const index = blockedUsers.indexOf(unblockUserId);
      
      if (index === -1) {
        return { message: "User is not blocked", statusCode: 400, success: false, data: null };
      }
  
      // Remove user from the blockedUsers array
      privacySettings.blockedUsers = blockedUsers.filter(user => user !== unblockUserId);
      await privacySettings.save();
  
      return { message: "User unblocked successfully", statusCode: 200, success: true, data: null };
    } catch (error) {
      console.error("Error unblocking user:", error);
      return { message: "Internal server error", statusCode: 500, success: false, data: null };
    }
  };
  
  const restrictUserService = async (userId, restrictUserId) => {
    try {
      const privacySettings = await db.UserPrivacySettings.findOne({ where: { userId } });
  
      if (!privacySettings) {
        return { message: "Privacy settings not found", statusCode: 404, success: false, data: null };
      }
  
      if (privacySettings.restrictedUsers && privacySettings.restrictedUsers.includes(restrictUserId)) {
        return { message: "User is already restricted", statusCode: 400, success: false, data: null };
      }
  
      privacySettings.restrictedUsers = [...(privacySettings.restrictedUsers || []), restrictUserId]; // Add to restrictedUsers array
      await privacySettings.save();
  
      return { message: "User restricted successfully", statusCode: 200, success: true, data: null };
    } catch (error) {
      console.error("Error restricting user:", error);
      return { message: "Internal server error", statusCode: 500, success: false, data: null };
    }
  };
  const unrestrictUserService = async (userId, unrestrictUserId) => {
    try {
      const privacySettings = await db.UserPrivacySettings.findOne({ where: { userId } });
  
      if (!privacySettings) {
        return { message: "Privacy settings not found", statusCode: 404, success: false, data: null };
      }
  
      const restrictedUsers = privacySettings.restrictedUsers || []; // Ensure it's an array
      const index = restrictedUsers.indexOf(unrestrictUserId);
      
      if (index === -1) {
        return { message: "User is not restricted", statusCode: 400, success: false, data: null };
      }
  
      // Remove user from the restrictedUsers array
      privacySettings.restrictedUsers = restrictedUsers.filter(user => user !== unrestrictUserId);
      await privacySettings.save();
  
      return { message: "User unrestricted successfully", statusCode: 200, success: true, data: null };
    } catch (error) {
      console.error("Error unrestricting user:", error);
      return { message: "Internal server error", statusCode: 500, success: false, data: null };
    }
  };

  const fetchBlockedUsersService = async (userId, page = 1, limit = 10) => {
    try {
      const privacySettings = await db.UserPrivacySettings.findOne({ where: { userId } });
  
      if (!privacySettings) {
        return { message: "Privacy settings not found", statusCode: 404, success: false, data: null };
      }
  
      const blockedUserIds = privacySettings.blockedUsers || [];
      const totalBlockedUsers = blockedUserIds.length;
  
      // Pagination
      const offset = (page - 1) * limit;
      const paginatedBlockedUserIds = blockedUserIds.slice(offset, offset + limit);
  
      // Fetch user details from Users model
      const blockedUsers = await db.User.findAll({
        where: {
          id: paginatedBlockedUserIds
        },
        attributes: ['id', 'username', 'fullName', 'profileImageUrl']
      });
  
      return {
        message: "Blocked users fetched successfully",
        statusCode: 200,
        success: true,
        data: {
          users: blockedUsers,
          total: totalBlockedUsers,
          currentPage: page,
          totalPages: Math.ceil(totalBlockedUsers / limit)
        }
      };
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      return { message: "Internal server error", statusCode: 500, success: false, data: null };
    }
  };
  const fetchRestrictedUsersService = async (userId, page = 1, limit = 10) => {
    try {
      const privacySettings = await db.UserPrivacySettings.findOne({ where: { userId } });
  
      if (!privacySettings) {
        return { message: "Privacy settings not found", statusCode: 404, success: false, data: null };
      }
  
      const restrictedUserIds = privacySettings.restrictedUsers || [];
      const totalRestrictedUsers = restrictedUserIds.length;
  
      // Pagination
      const offset = (page - 1) * limit;
      const paginatedRestrictedUserIds = restrictedUserIds.slice(offset, offset + limit);
  
      // Fetch user details from Users model
      const restrictedUsers = await db.User.findAll({
        where: {
          id: paginatedRestrictedUserIds
        },
        attributes: ['id', 'username', 'fullName', 'profileImageUrl']
      });
  
      return {
        message: "Restricted users fetched successfully",
        statusCode: 200,
        success: true,
        data: {
          users: restrictedUsers,
          total: totalRestrictedUsers,
          currentPage: page,
          totalPages: Math.ceil(totalRestrictedUsers / limit)
        }
      };
    } catch (error) {
      console.error("Error fetching restricted users:", error);
      return { message: "Internal server error", statusCode: 500, success: false, data: null };
    }
  };
  const hideStoryFromUsersService = async (userId, userToHide) => {
    try {
        const privacySettings = await db.UserPrivacySettings.findOne({ where: { userId } });

        if (!privacySettings) {
            return {
                message: 'User privacy settings not found.',
                statusCode: 404,
                success: false,
                data: null,
            };
        }

        // Check if userToHide is already in hideStoryFromUsers
        if (privacySettings.hideStoryFromUsers && privacySettings.hideStoryFromUsers.includes(userToHide)) {
            return {
                message: 'User is already in hideStoryFromUsers.',
                statusCode: 400,
                success: false,
                data: null,
            };
        }

        // Add userToHide to the hideStoryFromUsers array
        privacySettings.hideStoryFromUsers = [
            ...(privacySettings.hideStoryFromUsers || []), 
            userToHide
        ]; 

        await privacySettings.save();

        return {
            message: 'User added to hideStoryFromUsers.',
            statusCode: 200,
            success: true,
            data: null,
        };
    } catch (error) {
        console.error("Error adding user to hideStoryFromUsers:", error);
        return { 
            message: "Internal server error", 
            statusCode: 500, 
            success: false, 
            data: null 
        };
    }
};



const notHideStoryFromUsersService = async (userId, userToUnhide) => {
    try {
        const settings = await db.UserPrivacySettings.findOne({ where: { userId } });

        if (!settings) {
            return {
                message: 'User privacy settings not found.',
                statusCode: 404,
                success: false,
                data: null,
            };
        }

        const hiddenUsers = settings.hideStoryFromUsers || []; // Ensure it's an array
        const index = hiddenUsers.indexOf(userToUnhide);

        if (index === -1) {
            return {
                message: 'User is not in hideStoryFromUsers.',
                statusCode: 400,
                success: false,
                data: null,
            };
        }

        // Remove user from the hideStoryFromUsers array
        settings.hideStoryFromUsers = hiddenUsers.filter(id => id !== userToUnhide);
        await settings.save();

        return {
            message: 'User removed from hideStoryFromUsers.',
            statusCode: 200,
            success: true,
            data: null,
        };
    } catch (error) {
        console.error("Error removing user from hideStoryFromUsers:", error);
        return { message: "Internal server error", statusCode: 500, success: false, data: null };
    }
};
const fetchHideStoryFromUsersService = async (userId, page = 1, limit = 10) => {
    try {
        const settings = await db.UserPrivacySettings.findOne({ where: { userId } });

        if (!settings || !settings.hideStoryFromUsers) {
            return {
                message: 'No hidden story users found.',
                statusCode: 404,
                success: false,
                data: [],
            };
        }

        const hiddenUserIds = settings.hideStoryFromUsers;
        const totalHiddenUsers = hiddenUserIds.length;

        // Pagination
        const offset = (page - 1) * limit;
        const paginatedHiddenUserIds = hiddenUserIds.slice(offset, offset + limit);

        // Fetch user details from Users model
        const hiddenUsers = await db.User.findAll({
            where: {
                id: paginatedHiddenUserIds
            },
            attributes: ['id', 'username', 'fullName', 'profileImageUrl']
        });

        return {
            message: "Hidden story users fetched successfully",
            statusCode: 200,
            success: true,
            data: {
                users: hiddenUsers,
                total: totalHiddenUsers,
                currentPage: page,
                totalPages: Math.ceil(totalHiddenUsers / limit)
            }
        };
    } catch (error) {
        console.error("Error fetching hidden story users:", error);
        return { message: "Internal server error", statusCode: 500, success: false, data: null };
    }
};

module.exports = {
  getUserPrivacySettingsService,
  updateUserPrivacySettingsService,
  blockUserService,
  unblockUserService,
  restrictUserService,
  unrestrictUserService,
  fetchBlockedUsersService,
  fetchRestrictedUsersService,
  hideStoryFromUsersService,
  notHideStoryFromUsersService,
  fetchHideStoryFromUsersService,
};
