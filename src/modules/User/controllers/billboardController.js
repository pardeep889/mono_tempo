
const billboardService = require("../services/billboardService");

async function createBillboard(req, res) {
    try {
      const { chatId, name, description, imageUrl } = req.body;
      const userId = req.user.userId; // Fetch userId from the authenticated user

  
      // Call the service to create a billboard
      const { message, statusCode, success, data } = await billboardService.createBillboard({
        chatId,
        userId,
        name,
        description,
        imageUrl,
      });
  
  
      return res.status(statusCode).json({
        success,
        message,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  };


async function deleteBillboardController(req, res) {
  const { billboardId } = req.params;
  const userId = req.user.userId;

  const { message, statusCode, success, data } = await billboardService.deleteBillboard(billboardId, userId);

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}

async function updateBillboardController(req, res) {
  const { billboardId } = req.params;
  const userId = req.user.userId;
  const updateData = req.body;

  const { message, statusCode, success, data } = await billboardService.updateBillboard(billboardId, userId, updateData);

  return res.status(statusCode).json({
    success,
    message,
    data: data || null,
  });
}

async function fetchBillboardsController(req, res) {
  const { chatId } = req.params;

  const { message, statusCode, success, data } = await billboardService.fetchBillboardsByChatId(chatId);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

async function deleteBillboardsController(req, res) {
  const { chatId } = req.params;

  const { message, statusCode, success } = await billboardService.deleteBillboardsByChatId(chatId);

  return res.status(statusCode).json({
    success,
    message,
    data: null
  });
}
  
module.exports = {
  createBillboard,
  deleteBillboardController,
  updateBillboardController,
  fetchBillboardsController,
  deleteBillboardsController
}