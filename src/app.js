const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const routes = require('./startup/router');
const db = require('../sequelize/models')

app.use(cors());
app.use(cookieParser());
app.use(express.json());

(async () => {
    try {
      const eraseDatabaseOnSync = false;
      const alterDatabaseOnSync = true;
      await db.sequelize.sync({ alter: alterDatabaseOnSync, force: eraseDatabaseOnSync });
  
    }
    catch (e) {
      console.log('error while syncing with database', e);
    }
  })();

app.use(routes);
app.use((err,req,res,next)=>{
res.status(500).send();
next(err);
});

module.exports = app;