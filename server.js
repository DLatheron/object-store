'use strict';

const argv = require('yargs').argv;
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const express = require('express');
const logger = require('consola');
const nconf = require('nconf');

const app = express();

nconf.argv().env()
    .file('config', { file: argv.config || './config.json' })
    .defaults({
        port: 4000
    });

app.use(bodyParser.json());
app.use(busboy());
app.use(bodyParser.urlencoded({ extended: true }));

const port = argv.port || nconf.get('port');

const StoreRoute = require('./src/routes/StoreRoute');
const ObjectRoute = require('./src/routes/ObjectRoute');
const StoreManager = require('./src/StoreManager');

const storeManager = new StoreManager();
const storeRoute = new StoreRoute({ app, storeManager });
const objectRoute = new ObjectRoute({ app, storeManager });

storeRoute.initRoute();
objectRoute.initRoute();

app.listen(port, '0.0.0.0', 10000);
logger.start(`Object Store listening on port ${port}...`);
