// groupService.js
const { Op } = require("sequelize");
const db = require("../../../../sequelize/models");

async function createGroup(creatorId, name, description, type, members, icon) {
    console.log("Creating Group: ", creatorId, name, description, type, members, icon)
    try {
      // Create the group
      const group = await db.Group.create({
        name,
        description,
        type,
        creatorId,
        icon
      });
  
      // Add creator as ADMIN in GroupMembership
      await db.GroupMembership.create({
        groupId: group.id,
        userId: creatorId,
        role: "ADMIN",
      });
  
      // Add other members to the group with MEMBER role
      if (Array.isArray(members) && members.length > 0) {
        for (const memberId of members) {
          await db.GroupMembership.create({
            groupId: group.id,
            userId: memberId,
            role: "MEMBER",
          });
        }
      }
  
      return {
        message: "Group created successfully",
        statusCode: 201,
        success: true,
        data: group,
      };
    } catch (error) {
      console.error("Error creating group:", error);
      return { 
        message: "Internal Server Error", 
        statusCode: 500, 
        success: false, 
        data: null 
      };
    }
  }
  
  async function addGroupMember(groupId, userIds, adminId) {
    try {
        // Validate if userId is an array
      if (!Array.isArray(userIds)) {
        return {
          statusCode: 200,
          success: false,
          message: "Please send an array of userId like userId: []",
          data: null
        }
      }

      // Check if the requesting user is an admin of the group
      const isAdmin = await db.GroupMembership.findOne({
        where: {
          groupId,
          userId: adminId,
          role: "ADMIN",
        },
      });
  
      if (!isAdmin) {
        return {
          message: "Only group admins can add members",
          statusCode: 403,
          success: false,
          data: null,
        };
      }
  
      const addedUsers = [];
      const alreadyMembers = [];
  
      for (const userId of userIds) {
        // Check if the user is already a member of the group
        const existingMember = await db.GroupMembership.findOne({
          where: {
            groupId,
            userId,
          },
        });
  
        if (existingMember) {
          alreadyMembers.push(userId);
          continue;  // Skip to the next userId if already a member
        }
  
        // Add the user to the group with MEMBER role
        await db.GroupMembership.create({
          groupId,
          userId,
          role: "MEMBER",
        });
  
        addedUsers.push(userId);
      }
  
      // Return appropriate messages based on the result
      if (addedUsers.length > 0) {
        return {
          message: `Added ${addedUsers.length} users successfully. Already members: ${alreadyMembers.length > 0 ? alreadyMembers.join(", ") : "None"}`,
          statusCode: 200,
          success: true,
          data: { addedUsers, alreadyMembers },
        };
      } else {
        return {
          message: "All users are already members of this group",
          statusCode: 400,
          success: false,
          data: { alreadyMembers },
        };
      }
    } catch (error) {
      console.error("Error adding members to group:", error);
      return {
        message: "Internal Server Error",
        statusCode: 500,
        success: false,
        data: null,
      };
    }
  }
  async function fetchUserGroups(userId) {
    try {
      // Fetch groups the user is a member of
      const userGroups = await db.GroupMembership.findAll({
        where: { userId: userId }, // Assuming you want to fetch based on userId, not creatorId
        include: [{
          model: db.Group,
          as: 'Group', // This should match the alias in your model association
          attributes: ['id', 'name', 'description', 'type','createdAt', 'icon'], // Add more fields if needed
        }],
      });
      // Structure the response
      const response = userGroups.map(ug => ({
        groupId: ug.Group.id, // Ensure this matches the alias too
        groupName: ug.Group.name,
        groupDescription: ug.Group.description,
        groupType: ug.Group.type,
        userRole: ug.role,
        icon: ug.icon,
        createdAt: ug.Group.createdAt,
      }));
  
      return { 
        message: "User's groups fetched successfully", 
        statusCode: 200, 
        success: true, 
        data: response 
      };
    } catch (error) {
      console.error("Error fetching user's groups:", error);
      return { 
        message: "Internal Server Error", 
        statusCode: 500, 
        success: false, 
        data: null 
      };
    }
  }
  async function inviteUserToGroup(groupId, adminId, invitedUserId) {
    try {
      // Check if the user is an admin of the group
      const groupAdmin = await db.GroupMembership.findOne({
        where: {
          groupId: groupId,
          userId: adminId,
          role: 'ADMIN' // Assuming you have a role field
        }
      });
  
      if (!groupAdmin) {
        return { message: "Only group admins can invite users", statusCode: 403, success: false, data: null };
      }
  
      // Check if the user is already invited
      const existingInvite = await db.GroupInvite.findOne({
        where: { groupId: groupId, invitedUserId: invitedUserId }
      });
  
      if (existingInvite) {
        return { message: "User is already invited to this group", statusCode: 400, success: false ,data: null};
      }
  
      // Create an invite
      await db.GroupInvite.create({
        groupId: groupId,
        invitedUserId: invitedUserId,
        invitedBy: adminId
      });
  
      return { message: "User invited successfully", statusCode: 200, success: true , data: null};
    } catch (error) {
      console.error("Error inviting user to group:", error);
      return { message: "Internal Server Error", statusCode: 500, success: false , data: null};
    }
  }
  async function acceptGroupInvite(groupId, invitedUserId) {
    try {
      // Check if the invite exists
      const invite = await db.GroupInvite.findOne({
        where: { groupId: groupId, invitedUserId: invitedUserId }
      });
  
      if (!invite) {
        return { message: "No invite found for this user", statusCode: 404, success: false };
      }
  
      // Check if the user is already a member of the group
      const existingMember = await db.GroupMembership.findOne({
        where: { groupId: groupId, userId: invitedUserId }
      });
  
      if (existingMember) {
        return { message: "User is already a member of this group", statusCode: 400, success: false };
      }
  
      // Add the user to the group
      await db.GroupMembership.create({
        groupId: groupId,
        userId: invitedUserId,
        role: 'MEMBER' // Default role for new members
      });
  
      // Remove the invite
      await invite.destroy();
  
      return { message: "Successfully joined the group", statusCode: 200, success: true };
    } catch (error) {
      console.error("Error accepting group invite:", error);
      return { message: "Internal Server Error", statusCode: 500, success: false };
    }
  }
  
  

  async function makeAdmin(groupId, adminId, userId) {
    try {
      // Check if the requesting user is an admin of the group
      const groupAdmin = await db.GroupMembership.findOne({
        where: {
          groupId: groupId,
          userId: adminId,
          role: 'ADMIN' // Assuming you have a role field with 'admin' as a value
        }
      });
  
      if (!groupAdmin) {
        return { message: "Only group admins can promote other members to admin", statusCode: 403, success: false };
      }
  
      // Check if the target user is a member of the group
      const targetMember = await db.GroupMembership.findOne({
        where: {
          groupId: groupId,
          userId: userId
        }
      });
  
      if (!targetMember) {
        return { message: "User is not a member of this group", statusCode: 404, success: false };
      }
  
      // Update the user's role to 'admin'
      await targetMember.update({ role: 'ADMIN' });
  
      return { message: "User promoted to admin successfully", statusCode: 200, success: true };
    } catch (error) {
      console.error("Error promoting user to admin:", error);
      return { message: "Internal Server Error", statusCode: 500, success: false };
    }
  }
  

  async function fetchMyInvites(userId) {
    console.log("invited user id ", userId)
    try {
      // Fetch all invites where the user is the invited one
      const invites = await db.GroupInvite.findAll({
        where: { invitedUserId: userId },
        include: [
          {
            model: db.Group,
            as: 'group', // Alias 'Group' as 'group'
            attributes: ['id', 'name', 'icon'] // Include related group information
          },
          {
            model: db.User,
            as: 'inviter',
            attributes: ['id', 'username', 'profileImageUrl'] // Include inviter information
          }
        ]
      });
  
      if (!invites || invites.length === 0) {
        return { message: "No invites found", statusCode: 200, success: true , data: null};
      }
  
      return { data: invites, statusCode: 200, success: true , message: "Invites Fetched Successfully"};
    } catch (error) {
      console.error("Error fetching invites:", error);
      return { message: "Internal Server Error", statusCode: 500, success: false ,data: null};
    }
  }
  
  async function updateGroupDescription(groupId, userId, name, description, icon) {
    try {
      // Check if the user is an admin of the group
      const groupAdmin = await db.GroupMembership.findOne({
        where: {
          groupId: groupId,
          userId: userId,
          role: 'ADMIN', // Ensure the user is an admin
        }
      });
  
      if (!groupAdmin) {
        return { message: "Only group admins can update the description", statusCode: 403, success: false, data: null };
      }
  
      // Update the group's description
      const updatedGroup = await db.Group.update(
        {  name, description, icon },
        {
          where: { id: groupId },
          returning: true, // This ensures the updated group data is returned
          plain: true // Ensures that only the updated object is returned, not metadata
        }
      );
  
      if (updatedGroup[1] === 0) {
        return { message: "Group not found", statusCode: 404, success: false, data: null };
      }
  
      return { message: "Group description updated successfully", statusCode: 200, success: true, data: updatedGroup[1] };
    } catch (error) {
      console.error("Error updating group description:", error);
      return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
    }
  }

  async function leaveGroup(userId, groupId) {
    try {
      // Check if the user is a member of the group
      const groupMembership = await db.GroupMembership.findOne({
        where: { groupId: groupId, userId: userId }
      });
  
      if (!groupMembership) {
        return { message: "User is not a member of this group", statusCode: 404, success: false, data: null };
      }
  
      // Remove the user from the group
      await groupMembership.destroy();
  
      return { message: "Successfully left the group", statusCode: 200, success: true, data: null };
    } catch (error) {
      console.error("Error leaving the group:", error);
      return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
    }
  }

  async function fetchGroupUsers(groupId, page, limit) {
    try {
      const offset = (page - 1) * limit;
  
      const { rows: users, count } = await db.GroupMembership.findAndCountAll({
        where: { groupId },
        include: [
          {
            model: db.User,
            attributes: ['id', 'username', 'email', 'profileImageUrl', 'fullName'],
          }
        ],
        attributes: ['role'], // Include the role (ADMIN/MEMBER)
        offset,
        limit
      });
  
      if (users.length === 0) {
        return { message: "No users found in the group", statusCode: 404, success: false, data: null };
      }
  
      const totalPages = Math.ceil(count / limit);
  
      const formattedUsers = users.map(user => ({
        id: user.User.id,
        username: user.User.username,
        email: user.User.email,
        role: user.role,
        profileImageUrl: user.User.profileImageUrl,
        fullName: user.User.fullName
      }));
  
      return {
        message: "Users fetched successfully",
        statusCode: 200,
        success: true,
        data: {
          users: formattedUsers,
          currentPage: parseInt(page),
          totalPages
        }
      };
    } catch (error) {
      console.error("Error fetching group users:", error);
      return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
    }
  }
  

  async function removeUserFromGroupService(groupId, userId, adminId) {
    try {
      // Check if the requesting user is an ADMIN of the group
      const adminMembership = await db.GroupMembership.findOne({
        where: {
          groupId: groupId,
          userId: adminId,
          role: 'ADMIN',
        },
      });
  
      if (!adminMembership) {
        return { message: "Only group admins can remove users", statusCode: 403, success: false, data: null };
      }
  
      // Check if the user to be removed is a member of the group
      const userMembership = await db.GroupMembership.findOne({
        where: {
          groupId: groupId,
          userId: userId,
        },
      });
  
      if (!userMembership) {
        return { message: "User is not a member of the group", statusCode: 404, success: false, data: null };
      }
  
      // Remove the user from the group
      await db.GroupMembership.destroy({
        where: {
          groupId: groupId,
          userId: userId,
        },
      });
  
      return {
        message: "User removed from the group successfully",
        statusCode: 200,
        success: true,
        data: null,
      };
    } catch (error) {
      console.error("Error removing user from group:", error);
      return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
    }
  }

  async function getGroupDetails(groupId, userId) {
    try {
      // Fetch group details
      const group = await db.Group.findOne({
        where: { id: groupId },
        attributes: ['id', 'name', 'description', 'icon', 'type', 'creatorId', 'createdAt'],
        include: [
          {
            model: db.User,
            as: 'creator', // The alias defined in your Group model
            attributes: ['id', 'fullName', 'username', 'profileImageUrl'], // Specify the fields you want from the User model
          },
        ],
      });
  
      if (!group) {
        return { message: "Group not found", statusCode: 404, success: false, data: null };
      }
  
      // Check if the user is a member/admin of the group
      const groupMembership = await db.GroupMembership.findOne({
        where: {
          groupId: groupId,
          userId: userId,
        },
        attributes: ['role'], // Only need to fetch the role field
      });
  
      if (!groupMembership) {
        return { message: "User has no permission for this group", statusCode: 403, success: false, data: null };
      }

      const totalUsers = await db.GroupMembership.count({
        where: { groupId },
      });
  
      // Count total number of admins
      const totalAdmins = await db.GroupMembership.count({
        where: {
          groupId,
          role: 'ADMIN', // Assuming 'ADMIN' is the role you use for admins
        },
      });
  
      // Count total number of members
      const totalMembers = await db.GroupMembership.count({
        where: {
          groupId,
          role: 'MEMBER', // Assuming 'MEMBER' is the role you use for members
        },
      });
  
  
      return {
        message: "Group details fetched successfully",
        statusCode: 200,
        success: true,
        data: {
          group,
          role: groupMembership.role,
          stats: {
            totalUsers,
            totalAdmins,
            totalMembers,
          }, 
        },
      };
    } catch (error) {
      console.error("Error fetching group details:", error);
      return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
    }
  }
  
  
  async function searchGroups(name, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
  
      // Search groups by name
      const { count, rows } = await db.Group.findAndCountAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`
          }
        },
        attributes: ['id', 'name', 'description', 'icon', 'type'],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
  
      const totalPages = Math.ceil(count / limit);
  
      return {
        message: "Groups fetched successfully",
        statusCode: 200,
        success: true,
        data: {
          groups: rows,
          currentPage: parseInt(page),
          totalPages
        }
      };
    } catch (error) {
      console.error("Error searching groups:", error);
      return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
    }
  }

  async function togglePinMessageGroup(groupId, messageId, userId) {
    try {
      // Check if the user is an admin in the group
      const userMembership = await db.GroupMembership.findOne({
        where: {
          groupId: groupId,
          userId: userId,
          role: 'ADMIN', // Assuming 'ADMIN' is the role for admins
        },
      });
  
      if (!userMembership) {
        return { message: 'User does not have permission to pin/unpin messages', statusCode: 403, success: false, data: null };
      }
  
      // Check if the message exists and belongs to the correct group
      const message = await db.Message.findOne({
        where: {
          id: messageId,
          groupId: groupId
        },
      });
  
      if (!message) {
        return { message: 'Message not found', statusCode: 404, success: false, data: null };
      }
  
      // Check if the message is already pinned
      if (message.isPinned) {
        // Unpin the message
        message.isPinned = false;
        await message.save();
  
        return {
          message: 'Message unpinned successfully',
          statusCode: 200,
          success: true,
          data: { message },
        };
      } else {
        // Unpin any previously pinned message in the group
        await db.Message.update(
          { isPinned: false },
          { where: { chatId: groupId, isPinned: true } }
        );
  
        // Pin the selected message
        message.isPinned = true;
        await message.save();
  
        return {
          message: 'Message pinned successfully',
          statusCode: 200,
          success: true,
          data: { message },
        };
      }
    } catch (error) {
      console.error('Error pinning/unpinning message:', error);
      return { message: 'Internal Server Error', statusCode: 500, success: false, data: null };
    }
  }


  async function togglePrivatePinnedMessage(messageId, userId) {
    try {
      // Check if the user is an admin in the group
      const userIsSender = await db.Message.findOne({
        where: {
          senderId: userId,
        },
      });
  
      if (!userIsSender) {
        return { message: 'User does not have permission to pin/unpin messages', statusCode: 403, success: false, data: null };
      }
  
      // Check if the message exists and belongs to the correct group
      const message = await db.Message.findOne({
        where: {
          id: messageId,
          senderId: userId,
        },
      });
  
      if (!message) {
        return { message: 'Message not found', statusCode: 404, success: false, data: null };
      }
  
      // Check if the message is already pinned
      if (message.isPinned) {
        // Unpin the message
        message.isPinned = false;
        await message.save();
  
        return {
          message: 'Message unpinned successfully',
          statusCode: 200,
          success: true,
          data: { message },
        };
      } else {
        // Unpin any previously pinned message in the group
        await db.Message.update(
          { isPinned: false },
          { where: { id: messageId, senderId: userId, isPinned: true } }
        );
  
        // Pin the selected message
        message.isPinned = true;
        await message.save();
  
        return {
          message: 'Message pinned successfully',
          statusCode: 200,
          success: true,
          data: { message },
        };
      }
    } catch (error) {
      console.error('Error pinning/unpinning message:', error);
      return { message: 'Internal Server Error', statusCode: 500, success: false, data: null };
    }
  }
  

  async function toggleSelfPinnedMessage(messageId, userId) {
    try {
      // Check if the user is an admin in the group
      const userIsSender = await db.Message.findOne({
        where: {
          senderId: userId,
          isSelfChat: true
        },
      });
  
      if (!userIsSender) {
        return { message: 'User does not have permission to pin/unpin messages', statusCode: 403, success: false, data: null };
      }
  
      // Check if the message exists and belongs to the correct group
      const message = await db.Message.findOne({
        where: {
          id: messageId,
          senderId: userId,
        },
      });
  
      if (!message) {
        return { message: 'Message not found', statusCode: 404, success: false, data: null };
      }
  
      // Check if the message is already pinned
      if (message.isPinned) {
        // Unpin the message
        message.isPinned = false;
        await message.save();
  
        return {
          message: 'Message unpinned successfully',
          statusCode: 200,
          success: true,
          data: { message },
        };
      } else {
        // Unpin any previously pinned message in the group
        await db.Message.update(
          { isPinned: false },
          { where: { id: messageId, senderId: userId, isPinned: true } }
        );
  
        // Pin the selected message
        message.isPinned = true;
        await message.save();
  
        return {
          message: 'Message pinned successfully',
          statusCode: 200,
          success: true,
          data: { message },
        };
      }
    } catch (error) {
      console.error('Error pinning/unpinning message:', error);
      return { message: 'Internal Server Error', statusCode: 500, success: false, data: null };
    }
  }
  
  // Service function to handle the deletion logic
async function deleteGroupMessage(messageId, groupId, userId) {
  try {
    // Fetch the message to check groupId and sender
    const message = await db.Message.findOne({ where: { id: messageId, groupId } });
    
    if (!message) {
      return { message: "Message not found or does not belong to the specified group.", statusCode: 404, success: false, data: null };
    }

    // Check if the user is an admin of the group
    const membership = await db.GroupMembership.findOne({
      where: {
        groupId,
        userId,
        role: "ADMIN"
      }
    });

    if (!membership) {
      return { message: "You do not have permission to delete this message.", statusCode: 403, success: false, data: null };
    }

    // Delete the message
    await message.destroy();

    return {
      message: "Message deleted successfully.",
      statusCode: 200,
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Error deleting group message:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

async function removeGroupMember(groupId, userIds, adminId) {
  try {
    // Validate if userIds is an array
    if (!Array.isArray(userIds)) {
      return {
        statusCode: 200,
        success: false,
        message: "Please send an array of userId like userId: []",
        data: null
      };
    }

    // Check if the requesting user is an admin of the group
    const isAdmin = await db.GroupMembership.findOne({
      where: {
        groupId,
        userId: adminId,
        role: "ADMIN",
      },
    });

    if (!isAdmin) {
      return {
        message: "Only group admins can remove members",
        statusCode: 403,
        success: false,
        data: null,
      };
    }

    const removedUsers = [];
    const notMembers = [];

    for (const userId of userIds) {
      // Check if the user is a member of the group
      const existingMember = await db.GroupMembership.findOne({
        where: {
          groupId,
          userId,
        },
      });

      if (!existingMember) {
        notMembers.push(userId);  // User is not a member of the group
        continue;  // Skip to the next userId
      }

      // Remove the user from the group
      await db.GroupMembership.destroy({
        where: {
          groupId,
          userId,
        },
      });

      removedUsers.push(userId);
    }

    // Return appropriate messages based on the result
    if (removedUsers.length > 0) {
      return {
        message: `Removed ${removedUsers.length} users successfully. Not members: ${notMembers.length > 0 ? notMembers.join(", ") : "None"}`,
        statusCode: 200,
        success: true,
        data: { removedUsers, notMembers },
      };
    } else {
      return {
        message: "None of the users were members of this group",
        statusCode: 400,
        success: false,
        data: { notMembers },
      };
    }
  } catch (error) {
    console.error("Error removing members from group:", error);
    return {
      message: "Internal Server Error",
      statusCode: 500,
      success: false,
      data: null,
    };
  }
}

async function adminToMember(groupId, targetUserId, requestingUserId) {
  try {
    // Check if the requesting user is an admin of the group
    const isAdmin = await db.GroupMembership.findOne({
      where: {
        groupId,
        userId: requestingUserId,
        role: "ADMIN",
      },
    });

    if (!isAdmin) {
      return {
        message: "Only group admins can change roles",
        statusCode: 403,
        success: false,
        data: null,
      };
    }

    // Check if the target user is an admin in the group
    const targetUser = await db.GroupMembership.findOne({
      where: {
        groupId,
        userId: targetUserId,
        role: "ADMIN",
      },
    });

    if (!targetUser) {
      return {
        message: "Target user is not an admin in this group",
        statusCode: 404,
        success: false,
        data: null,
      };
    }

    // Demote the target user to a member
    targetUser.role = "MEMBER";
    await targetUser.save();

    return {
      message: `User ${targetUserId} has been demoted to a member successfully`,
      statusCode: 200,
      success: true,
      data: { targetUserId, newRole: "MEMBER" },
    };

  } catch (error) {
    console.error("Error demoting admin to member:", error);
    return {
      message: "Internal Server Error",
      statusCode: 500,
      success: false,
      data: null,
    };
  }
}

  module.exports = {
    createGroup,
    addGroupMember,
    fetchUserGroups,
    inviteUserToGroup,
    acceptGroupInvite,
    makeAdmin,
    fetchMyInvites,
    updateGroupDescription,
    leaveGroup,
    fetchGroupUsers,
    removeUserFromGroupService,
    getGroupDetails,
    searchGroups,
    togglePinMessageGroup,
    togglePrivatePinnedMessage,
    toggleSelfPinnedMessage,
    deleteGroupMessage,
    removeGroupMember,
    adminToMember
  };