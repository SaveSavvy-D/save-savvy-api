const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const ConnectDB = require('./src/configs/database');

const app = express();
app.use(cookieParser());
dotenv.config();
ConnectDB();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: process.env.APP_URL || '' }));

const indexRoute = require('./src/routes/index');

app.use('/api', indexRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
