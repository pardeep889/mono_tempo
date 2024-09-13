const db = require("../../../../sequelize/models");
const admin = require("../../../util/firebase");


// Function to send push notification
const sendPushNotification = async(title, message , type,  receiverId , referenceId) => {
  console.log("Notification Data to be send is: ", title, message , type, receiverId,  referenceId);
  const userDevices = await fetchUserDevices(receiverId);

  userDevices.forEach(device => {
    const fcmToken = device.dataValues.fcmToken;
    const data =  {
      type,
      referenceId
    }

    const sanitizedData = {};
    for (let key in data) {
      sanitizedData[key] = String(data[key]); // Ensure each value is a string
    }
    const payload = {
      notification: {
        title: title,
        body: message
      },
      data: sanitizedData || null,
      token: fcmToken
    };

    admin.messaging().send(payload)
      .then(response => {
        console.log('Successfully sent message:', response);
      })
      .catch(error => {
        console.log('Error sending message:', error);
      });
  });
  
};

const fetchUserDevices = async (receiverId) => {
  const userDevices = await db.Device.findAll({
    where: { userId: receiverId },
    attributes: ['fcmToken']
  });

  return userDevices;
}



// Create a notification
async function createNotification(senderId, receiverId, title , message, type, referenceId) {
  
  try {
    

    sendPushNotification(title, message, type, receiverId, referenceId); // Send notification
    
    const notification = await db.Notification.create({
      senderId, receiverId, title , message, type, referenceId,
      isRead: false // Notifications are unread by default
    });

    return {
      message: "Notification created successfully",
      statusCode: 201,
      success: true,
      data: { notification }
    };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

// List notifications for a specific user
async function listNotifications(userId, pSize = 10, page = 1) {
  try {
    const limit = parseInt(pSize); // Number of notifications per page
    const offset = (page - 1) * limit; // Calculate offset based on the page number

    const { count, rows: notifications } = await db.Notification.findAndCountAll({
      where: { receiverId: userId },
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']] // Optional: To sort by latest notifications
    });

    const totalPages = Math.ceil(count / limit); // Calculate total pages

    return {
      message: "Notifications fetched successfully",
      statusCode: 200,
      success: true,
      data: {
        notifications,
        currentPage: page,
        totalPages,
        totalNotifications: count
      }
    };
  } catch (error) {
    console.error("Error listing notifications:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}


// Mark a notification as read
async function markAsRead(userId, notificationId) {
  try {
    const notification = await db.Notification.findOne({ where: { id: notificationId, receiverId: userId } });

    if (!notification) {
      return { message: "Notification not found", statusCode: 404, success: false, data: null };
    }

    notification.isRead = true;
    await notification.save();

    return {
      message: "Notification marked as read",
      statusCode: 200,
      success: true,
      data: { notification }
    };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

// Delete a notification
async function deleteNotification(userId, notificationId) {
  try {
    const notification = await db.Notification.findOne({ where: { id: notificationId, receiverId: userId } });

    if (!notification) {
      return { message: "Notification not found", statusCode: 404, success: false, data: null };
    }

    await notification.destroy();

    return {
      message: "Notification deleted successfully",
      statusCode: 200,
      success: true,
      data: null
    };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

async function sendNotificationToUser(senderId, receiverId, title , message, type, referenceId) {
  try {
    sendPushNotification(title, message, type, receiverId, referenceId); // Send notification
    
   await db.Notification.create({
      senderId, receiverId, title , message, type, referenceId,
      isRead: false // Notifications are unread by default
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  createNotification,
  listNotifications,
  markAsRead,
  deleteNotification,
  sendPushNotification,
  sendNotificationToUser
};
