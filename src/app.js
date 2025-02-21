import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bcryptjs from 'bcryptjs';
const { compare } = bcryptjs;

import jwt from 'jsonwebtoken';
const { sign } = jwt;

import db, { sequelize } from './models/index.js';
import initializeUser from './models/user.js';
import initializeProject from './models/project.js';
import initializeTask from './models/task.js';
import auth from './middleware/auth.js';

const User = initializeUser(sequelize);
const Project = initializeProject(sequelize);
const Task = initializeTask(sequelize);

db.User = User;
db.Project = Project;
db.Task = Task;

import initializeRelations from './models/relations.js';
initializeRelations(db);

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user || !(await compare(req.body.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/projects', auth, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/projects', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user.id }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/projects/:id', auth, async (req, res) => {
  try {
    const [updated] = await Project.update(req.body, {
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    const project = await Project.findByPk(req.params.id);
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/projects/:id', auth, async (req, res) => {
  try {
    const deleted = await Project.destroy({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/projects/:projectId/tasks', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ 
      where: { 
        id: req.params.projectId,
        userId: req.user.id
      }
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const task = await Task.create({
      ...req.body,
      projectId: project.id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/projects/:projectId/tasks', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ 
      where: { 
        id: req.params.projectId,
        userId: req.user.id
      }
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const tasks = await Task.findAll({
      where: { projectId: req.params.projectId }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{
        model: Project,
        where: { userId: req.user.id }
      }]
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{
        model: Project,
        where: { userId: req.user.id }
      }]
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;