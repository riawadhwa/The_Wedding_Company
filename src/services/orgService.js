const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { MasterOrg, Admin } = require("../models/MasterOrg");
const { cleanOrgName } = require("../utils/clean");
const ERR = require("../utils/errors");

class OrgService {
  async createOrganization({ organization_name, email, password }) {
    const clean_org_name = cleanOrgName(organization_name);

    const exists = await MasterOrg.findOne({
      organization_name: clean_org_name,
    });

    if (exists) throw ERR.ORG_ALREADY_EXISTS;

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: passwordHash,
    });

    const collectionName = `org_${clean_org_name}`;
    await mongoose.connection.createCollection(collectionName);

    const org = await MasterOrg.create({
      organization_name: clean_org_name,
      org_collection_name: collectionName,
      connection_details: { db: mongoose.connection.name },
      admin: admin._id,
    });

    return org;
  }

  async getOrganization(organization_name) {
    const clean_org_name = cleanOrgName(organization_name);

    const org = await MasterOrg.findOne({
      organization_name: clean_org_name,
    });

    if (!org) throw ERR.ORG_NOT_FOUND;

    return org;
  }

  async updateOrganization({ email, password, new_organization_name }) {
    const admin = await Admin.findOne({ email });
    if (!admin) throw ERR.INVALID_ADMIN_CREDENTIALS;

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw ERR.INVALID_ADMIN_CREDENTIALS;

    const org = await MasterOrg.findOne({ admin: admin._id });
    if (!org) throw ERR.ORG_NOT_FOUND;

    const newSan = cleanOrgName(new_organization_name);
    const newCollectionName = `org_${newSan}`;

    await mongoose.connection.createCollection(newCollectionName);

    const oldCollectionName = org.org_collection_name;
    const oldCol = mongoose.connection.collection(oldCollectionName);
    const newCol = mongoose.connection.collection(newCollectionName);

    const oldDocs = await oldCol.find({}).toArray();
    if (oldDocs.length > 0) await newCol.insertMany(oldDocs);

    await mongoose.connection.dropCollection(oldCollectionName);

    org.organization_name = newSan;
    org.org_collection_name = newCollectionName;
    await org.save();

    return org;
  }

  async loginAdmin({ email, password }) {
    const admin = await Admin.findOne({ email });
    if (!admin) throw ERR.INVALID_ADMIN_CREDENTIALS;

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw ERR.INVALID_ADMIN_CREDENTIALS;

    const org = await MasterOrg.findOne({ admin: admin._id });
    if (!org) throw ERR.ORG_NOT_FOUND;

    const token = jwt.sign(
      { adminId: admin._id, orgId: org._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return { token };
  }

  async deleteOrganization(organization_name) {
    const clean_org_name = cleanOrgName(organization_name);

    const org = await MasterOrg.findOne({
      organization_name: clean_org_name,
    });

    if (!org) throw ERR.ORG_NOT_FOUND;

    const db = mongoose.connection.db;
    const colExists = await db
      .listCollections({ name: org.org_collection_name })
      .hasNext();

    if (colExists) await db.dropCollection(org.org_collection_name);

    await Admin.findByIdAndDelete(org.admin);
    await MasterOrg.findByIdAndDelete(org._id);

    return true;
  }
}

module.exports = new OrgService();
