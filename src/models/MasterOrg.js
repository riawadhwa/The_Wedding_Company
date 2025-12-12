const mongoose = require('mongoose');

const MasterOrgSchema = new mongoose.Schema({
    organization_name: {type: String, required: true, unique: true},
    org_collection_name: {type: String, required: true, unique: true},
    connection_details: {type: Object, default: {} },
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true},
    createdAt: { type: Date, default: Date.now }
});

const AdminSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true}
}, {_id: true});

module.exports = {
    MasterOrg : mongoose.model('MasterOrg', MasterOrgSchema, 'master_organizations'),
    Admin : mongoose.model('MasterAdmin', AdminSchema, 'master_admins')
};