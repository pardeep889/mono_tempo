const { getGeoLocation } = require("../../util/util");
const deviceService = require("../services/deviceService");


// Register a new device (or update FCM token if device already exists)
async function registerDeviceController(req, res) {
  const { deviceId, fcmToken, deviceType, name } = req.body;
  const userId = req.user.userId;
  let userIp = req.headers['x-forwarded-for'] || req.ip;
  if (userIp === '::1') {
    userIp = '127.0.0.1'; // Convert IPv6 localhost to IPv4 localhost
  }
  let location = null;

  const geolocation = await getGeoLocation(userIp);

  if(geolocation.status === 'success'){
    location = geolocation;
  }

  const { message, statusCode, success, data } = await deviceService.registerDevice(userId, deviceId, fcmToken, deviceType, name,location, userIp);

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
