import pkg from 'jsonwebtoken';
const { verify } = pkg;
import db from '../models/index.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(decoded.id);
    
    if (!user) throw new Error();
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

export default auth;