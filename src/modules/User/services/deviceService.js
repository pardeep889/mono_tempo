const db = require("../../../../sequelize/models");

// Register or update a device
async function registerDevice(userId, deviceId, fcmToken, deviceType, name, location, userIp) {
  try {
    let device = await db.Device.findOne({ where: { userId, deviceId } });

    if (!device) {
      // Create new device if not found
      device = await db.Device.create({
        userId,
        deviceId,
        fcmToken,
        deviceType,
        name,
        location, 
        ip: userIp
      });

      return {
        message: "Device registered successfully",
        statusCode: 201,
        success: true,
        data: { device }
      };
    }

    // If device exists, update the FCM token
    device.fcmToken = fcmToken;
    await device.save();

    return {
      message: "Device updated successfully",
      statusCode: 200,
      success: true,
      data: { device }
    };
  } catch (error) {
    console.error("Error registering/updating device:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

// Update the FCM token for a specific device
async function updateDevice(id , userId, deviceId, fcmToken, deviceType) {
  try {
    let device = await db.Device.findOne({ where: { userId, id } });

    if (!device) {
      return { message: "Device not found", statusCode: 404, success: false, data: null };
    }

    device.fcmToken = fcmToken;
    device.deviceId = deviceId;
    device.deviceType = deviceType;
    await device.save();

    return {
      message: "Device updated successfully",
      statusCode: 200,
      success: true,
      data: { device }
    };
  } catch (error) {
    console.error("Error updating device:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

// Fetch all devices associated with a user
async function fetchUserDevices(userId) {
  try {
    const devices = await db.Device.findAll({ where: { userId } });

    return {
      message: "Devices fetched successfully",
      statusCode: 200,
      success: true,
      data: { devices }
    };
  } catch (error) {
    console.error("Error fetching devices:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

// Delete a specific device
async function deleteDevice(userId, id) {
  try {
    const device = await db.Device.findOne({ where: { userId, id } });

    if (!device) {
      return { message: "Device not found", statusCode: 404, success: false, data: null };
    }

    await device.destroy();

    return {
      message: "Device deleted successfully",
      statusCode: 200,
      success: true,
      data: null
    };
  } catch (error) {
    console.error("Error deleting device:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

module.exports = {
  registerDevice,
  updateDevice,
  fetchUserDevices,
  deleteDevice
};
