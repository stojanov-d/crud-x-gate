import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import initializeUser from './user.js';
import initializeProject from './project.js';
import initializeTask from './task.js';
import initializeRelations from './relations.js';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const User = initializeUser(sequelize);
const Project = initializeProject(sequelize);
const Task = initializeTask(sequelize);

const db = { 
  sequelize, 
  Sequelize,
  User,
  Project,
  Task 
};

initializeRelations(db);

export { sequelize };
export default db;