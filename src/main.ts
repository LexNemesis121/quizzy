/*******************************
 *           IMPORTS           *
 *******************************/
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// imports for routes
import swaggerSetup from './routes/swaggerSetup';
import authRoutes from './routes/authRoutes';
import proxyRoutes from './routes/proxyRoutes';

/*******************************
 *       CONFIGURATION         *
 *******************************/
dotenv.config();
const app = express();

import fs from 'fs';
const dbPath = process.env.SQL_DB_FILE;
if (dbPath) {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '', 'utf-8');
  }

  const SQLiteStoreInstance = SQLiteStore(session);
  app.use(session({
    store: new SQLiteStoreInstance({
      db: dbPath,
    }) as session.Store,
    secret: process.env.JWT_SECRET || 'eZgAl+XqTNW0skN85crbMQ==',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }));
} else {
  console.error('Database file path is undefined.');
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

/*******************************
 *           ROUTES            *
 *******************************/

app.use('/auth', authRoutes);
app.use('/', proxyRoutes);
app.use('/swagger', swaggerSetup);

/*******************************
 *             RUN             *
 *******************************/
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`);
});
