const deviceService = require("../services/deviceService");

// Register a new device (or update FCM token if device already exists)
async function registerDeviceController(req, res) {
  const { deviceId, fcmToken, deviceType } = req.body;
  const userId = req.user.userId;

  const { message, statusCode, success, data } = await deviceService.registerDevice(userId, deviceId, fcmToken, deviceType);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

// Update device (e.g., update FCM token)
async function updateDeviceController(req, res) {
  const { deviceId, fcmToken, deviceType } = req.body;
  const id = req.params.id;

  const userId = req.user.userId;

  const { message, statusCode, success, data } = await deviceService.updateDevice(id, userId, deviceId, fcmToken, deviceType);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

// Fetch all devices for the authenticated user
async function fetchUserDevicesController(req, res) {
  const userId = req.user.userId;

  const { message, statusCode, success, data } = await deviceService.fetchUserDevices(userId);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

// Delete a device (unregister it)
async function deleteDeviceController(req, res) {
  const { id } = req.params;
  const userId = req.user.userId;

  const { message, statusCode, success, data } = await deviceService.deleteDevice(userId, id);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

module.exports = {
  registerDeviceController,
  updateDeviceController,
  fetchUserDevicesController,
  deleteDeviceController
};
