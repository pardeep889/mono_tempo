const axios = require('axios');
const db = require("../../../sequelize/models");

async function getGeoLocation(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return null;
  }
}



function generateRandomCodeString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}


function generateRandomCodeNumber8Digit() {
  const min = 10000000; // Minimum 8-digit number
  const max = 99999999; // Maximum 8-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  const microseconds = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}`;
}


const fetchGroupDetailsUtilService = async (groupId) => {
  const group = await db.Group.findOne({
    where: { id: groupId },
    attributes: ['id', 'name'] // Only select id and name
  });
  return group.dataValues;
}

const fetchUserDetailsUtilService = async (userId) => {
  const user = await db.User.findOne({
    where: { id: userId },
    attributes: ['id', 'fullName'] // Only select id and name
  });
  return user.dataValues;
}


async function fetchGroupUsersUtilService(groupId) {
  try {
    // Directly query for user IDs from the database
    const users = await db.GroupMembership.findAll({
      where: { groupId },
      include: [
        {
          model: db.User,
          attributes: ['id'], // Fetch only the user id
        }
      ],
      attributes: [], // We don't need any attributes from GroupMembership
      raw: true // Get raw results from Sequelize
    });

    // If no users found, return an empty array
    if (!users.length) {
      return [];
    }
    return users;
  } catch (error) {
    console.error("Error fetching group users:", error);
    return [];
  }
}


module.exports = {generateRandomCodeNumber8Digit, generateRandomCodeString, getFormattedDate, fetchGroupDetailsUtilService, fetchUserDetailsUtilService, fetchGroupUsersUtilService, getGeoLocation};
