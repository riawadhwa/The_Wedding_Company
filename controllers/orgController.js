const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { MasterOrg, Admin } = require("../models/MasterOrg");
const { cleanOrgName } = require("../utils/clean");
const { isValidEmail, isValidPassword } = require("../utils/validators");
const ERR = require("../utils/errors");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

exports.createOrg = async (req, res) => {
  try {
    const { organization_name, email, password } = req.body;

    if (!organization_name) return res.status(400).json(ERR.INVALID_ORG_NAME);
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Admin email and password required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json(ERR.INVALID_EMAIL_FORMAT);
    }
    if (!isValidPassword(password)) {
      return res.status(400).json(ERR.INVALID_PASSWORD_FORMAT);
    }

    const clean_org_name = cleanOrgName(organization_name);

    const exists = await MasterOrg.findOne({
      organization_name: clean_org_name,
    });

    if (exists) return res.status(400).json(ERR.ORG_ALREADY_EXISTS);

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ email, password: passwordHash });

    const collectionName = `org_${clean_org_name}`;

    await mongoose.connection.createCollection(collectionName);

    const org = await MasterOrg.create({
      organization_name: clean_org_name,
      org_collection_name: collectionName,
      collection_details: { db: mongoose.connection.name },
      admin: admin._id,
    });

    return res.status(201).json({
      message: "Organization Created Successfully!",
      data: org,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        message: `The ${field} '${err.keyValue[field]}' is already in use.`,
        error_code: "CLIENT_DUPLICATE_KEY",
      });
    }

    if (err.code === 48 && err.errmsg.includes("Collection")) {
      return res.status(409).json({
        message: "A collection for this organization name already exists.",
        error_code: "COLLECTION_EXISTS",
      });
    }

    return res.status(500).json(ERR.INTERNAL_ERROR);
  }
};

exports.getOrg = async (req, res) => {
  try {
    const { organization_name } = req.body;

    if (!organization_name) return res.status(400).json(ERR.INVALID_ORG_NAME);
    const clean_org_name = cleanOrgName(organization_name);
    const org = await MasterOrg.findOne({ organization_name: clean_org_name });
    if (!org) return res.status(404).json(ERR.ORG_NOT_FOUND);

    res.json(org);
  } catch (err) {
    res.status(500).json(ERR.INTERNAL_ERROR);
  }
};

exports.updateOrg = async (req, res) => {
  try {
    const { new_organization_name, email, password } = req.body;

    if (!new_organization_name)
      return res.status(400).json(ERR.INVALID_ORG_NAME);

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json(ERR.INVALID_ADMIN_CREDENTIALS);
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json(ERR.INVALID_ADMIN_CREDENTIALS);

    const org = await MasterOrg.findOne({ admin: admin._id });
    if (!org) return res.status(404).json(ERR.ORG_NOT_FOUND);

    if (new_organization_name) {
      const newSan = cleanOrgName(new_organization_name);
      const newCollectionName = `org_${newSan}`;

      await mongoose.connection.createCollection(newCollectionName);

      const oldCollectionName = org.org_collection_name;
      const oldCol = mongoose.connection.collection(oldCollectionName);
      const newCol = mongoose.connection.collection(newCollectionName);

      const oldDocs = await oldCol.find({}).toArray();

      if (oldDocs.length > 0) {
        await newCol.insertMany(oldDocs);
      }

      await mongoose.connection.dropCollection(oldCollectionName);

      org.organization_name = new_organization_name;
      org.org_collection_name = newCollectionName;
      await org.save();
    }

    res.json({ message: "Organization updated", org });
  } catch (err) {
    res.status(500).json(ERR.INTERNAL_ERROR);
  }
};
