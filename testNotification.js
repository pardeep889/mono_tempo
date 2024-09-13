const admin = require("./src/util/firebase")


const sendPushNotification = (token, title, message) => {
    const payload = {
      notification: {
        title: title,
        body: message
      },
      token: token
    };
  
    admin.messaging().send(payload)
      .then(response => {
        console.log('Successfully sent message:', response);
      })
      .catch(error => {
        console.log('Error sending message:', error);
      });
  };

// Example usage
const deviceToken = 'cLeAl5tcTpSIteB55nG9nF:APA91bE_P2HaMJHiqK_n5EP0jnWCF2m3O5Xf64bX_FJm6dglaYGQkAOLoWxc-a77pNel8cwE0D2mYj4t2aZjhcWjtmHAqFNImwxwXqBZxdontakg52N-RB0NjVDNfyOfFmU5lndw4AxF';  // Replace with the device token
const notificationTitle = 'Test Notification';
const notificationMessage = 'This is a test notification from Firebase!';

sendPushNotification(deviceToken, notificationTitle, notificationMessage);