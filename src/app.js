const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./startup/router');
const db = require('../sequelize/models');

const appFactory = (io) => {
    const app = express();

    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());

    // Sync with database
    (async () => {
        try {
            const eraseDatabaseOnSync = false;
            const alterDatabaseOnSync = true;
            await db.sequelize.sync({ alter: alterDatabaseOnSync, force: eraseDatabaseOnSync });
        } catch (e) {
            console.log('Error while syncing with database', e);
        }
    })();

    // Middleware to attach `io` instance to the app
    app.set('io', io);

    // Use routes
    app.use(routes);

    // Error handling middleware
    app.use((err, req, res, next) => {
        res.status(500).send();
        next(err);
    });

    return app;
};

module.exports = appFactory;
