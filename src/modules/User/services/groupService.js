// groupService.js
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
        data: { groupId: group.id },
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
  

async function addGroupMember(groupId, userId) {
  try {
    // Check if the user is already a member of the group
    const existingMember = await db.GroupMembership.findOne({
      where: {
        groupId,
        userId,
      },
    });

    if (existingMember) {
      return {
        message: "User is already a member of this group",
        statusCode: 400,
        success: false,
        data: null,
      };
    }

    // Add the user to the group with MEMBER role
    await db.GroupMembership.create({
      groupId,
      userId,
      role: "MEMBER",
    });

    return {
      message: "User added to the group successfully",
      statusCode: 200,
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Error adding member to group:", error);
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
};
