const { Billboard , Chat, GroupMembership } = require("../../../../sequelize/models");

async function createBillboard({ chatId, userId, name, description, imageUrl }) {
  try {
    // Fetch chat details to check its type
    const chat = await Chat.findOne({ where: { id: chatId } });

    if (!chat) {
      return {
        success: false,
        message: 'Chat not found',
        statusCode: 404,
        data: null,
      };
    }

    // Handle different chat types
    if (chat.type === 'GROUP') {
      // If chat type is GROUP, check if the user is an admin
      const groupMembership = await GroupMembership.findOne({
        where: {
          groupId: chat.groupId,
          userId: userId,
        },
      });

      if (!groupMembership || groupMembership.role !== 'ADMIN') {
        return {
          success: false,
          message: 'Only admins can create a billboard in group chats',
          statusCode: 403,
          data: null,
        };
      }
    } else if (chat.type === 'PRIVATE') {
      // If chat type is PRIVATE, check if the user is part of the chat
      if (chat.userId !== userId && chat.receiverId !== userId) {
        return {
          success: false,
          message: 'You are not authorized to create a billboard in this private chat',
          statusCode: 403,
          data: null,
        };
      }
    } else if (chat.type === 'SELF') {
      // If chat type is SELF, check if the current user is the chat owner
      if (chat.userId !== userId) {
        return {
          success: false,
          message: 'You can only create billboards in your own self chat',
          statusCode: 403,
          data: null,
        };
      }
    }

    // Check if the chat already has 3 billboards
    const billboardCount = await Billboard.count({ where: { chatId } });

    if (billboardCount >= 3) {
      return {
        success: false,
        message: 'Each chat can have a maximum of 3 billboards.',
        statusCode: 400,
        data: null,
      };
    }

    // Create the billboard
    const newBillboard = await Billboard.create({
      chatId,
      name,
      description,
      imageUrl,
      userId
    });

    return {
      success: true,
      message: 'Billboard created successfully',
      statusCode: 201,
      data: newBillboard,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error creating billboard',
      statusCode: 500,
      data: null,
      error: error.message,
    };
  }
};
async function deleteBillboard(billboardId, userId) {
  try {
    // Find the billboard by its ID
    const billboard = await Billboard.findOne({
      where: { id: billboardId },
    });

    if (!billboard) {
      return {
        success: false,
        statusCode: 404,
        message: 'Billboard not found',
        data: null
      };
    }

    // Check if the billboard was created by the current user
    if (billboard.userId !== userId) {
      return {
        success: false,
        statusCode: 403,
        message: 'You do not have permission to delete this billboard',
        data: null

      };
    }

    // Delete the billboard
    await Billboard.destroy({
      where: { id: billboardId },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Billboard deleted successfully',
      data: null

    };
  } catch (error) {
    console.error('Error deleting billboard:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
      data: null

    };
  }
}

async function updateBillboard(billboardId, userId, updateData) {
  try {
    // Find the billboard by its ID
    const billboard = await Billboard.findOne({
      where: { id: billboardId },
    });

    if (!billboard) {
      return {
        success: false,
        statusCode: 404,
        message: 'Billboard not found',
      };
    }

    // Check if the billboard was created by the current user
    if (billboard.userId !== userId) {
      return {
        success: false,
        statusCode: 403,
        message: 'You do not have permission to update this billboard',
      };
    }

    // Update the billboard
    await Billboard.update(updateData, {
      where: { id: billboardId },
    });

    // Fetch the updated billboard
    const updatedBillboard = await Billboard.findOne({
      where: { id: billboardId },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Billboard updated successfully',
      data: updatedBillboard,
    };
  } catch (error) {
    console.error('Error updating billboard:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    };
  }
}

async function fetchBillboardsByChatId(chatId) {
  try {
    // Fetch billboards by chat ID
    const billboards = await Billboard.findAll({
      where: { chatId },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Billboards fetched successfully',
      data: billboards,
    };
  } catch (error) {
    console.error('Error fetching billboards:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    };
  }
}

async function deleteBillboardsByChatId(chatId) {
  try {
    // Delete all billboards by chat ID
    const result = await Billboard.destroy({
      where: { chatId },
    });

    if (result > 0) {
      return {
        success: true,
        statusCode: 200,
        message: 'Billboards deleted successfully',
      };
    } else {
      return {
        success: false,
        statusCode: 404,
        message: 'No billboards found for the given chat ID',
      };
    }
  } catch (error) {
    console.error('Error deleting billboards:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    };
  }
}

module.exports = {
  createBillboard,
  deleteBillboard,
  updateBillboard,
  fetchBillboardsByChatId,
  deleteBillboardsByChatId
};