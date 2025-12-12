const jwt = require("jsonwebtoken");
const { MasterOrg, Admin } = require("../models/MasterOrg");
const ERR = require("../utils/errors");

async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json(ERR.UNAUTHORIZED);
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.adminId);
    if (!admin) return res.status(401).json(ERR.UNAUTHORIZED);

    const org = await MasterOrg.findById(decoded.orgId);
    if (!org) return res.status(401).json(ERR.UNAUTHORIZED);

    req.auth = { admin };
    next();
  } catch (err) {
    return res.status(401).json(ERR.UNAUTHORIZED);
  }
}

module.exports = authMiddleware;
