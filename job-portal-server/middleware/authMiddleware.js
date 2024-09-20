const admin = require("firebase-admin");

const authenticateToken = async (req, res, next) => {
  // console.log(req.headers); // show headers received
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Error from middlewareAuth: Authorization header missing');
  }

  const token = authHeader.split(' ')[1];
  // console.log('Token received:', token);  // log token
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token in middlewateAuth:', error);
    return res.status(401).send('Unauthorized');
  }
};

module.exports = authenticateToken;
