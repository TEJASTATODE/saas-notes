const { verifyToken } = require('../utils/jwt');

const requireAuth = async (req, res, next) => {
    try {
      
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: no token provided' });
        }

       
        const token = authHeader.split(' ')[1];

    
        const userData = await verifyToken(token);
        req.user = userData; 
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized: invalid token' });
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
        }
        next();
    };
};

module.exports = { requireAuth, requireRole };
