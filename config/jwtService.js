import jwt from 'jsonwebtoken';  


export const generateToken = (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );
  return token;
};


export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded; 
  } catch (error) {
    throw new Error('Invalid token'); 
  }
};