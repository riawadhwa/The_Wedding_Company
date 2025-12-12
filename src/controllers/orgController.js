const orgService = require("../services/orgService");
const { isValidEmail, isValidPassword } = require("../utils/validators");
const ERR = require("../utils/errors");

exports.createOrg = async (req, res) => {
  try {
    const { organization_name, email, password } = req.body;

    if (!organization_name) return res.status(400).json(ERR.INVALID_ORG_NAME);
    if (!isValidEmail(email))
      return res.status(400).json(ERR.INVALID_EMAIL_FORMAT);
    if (!isValidPassword(password))
      return res.status(400).json(ERR.INVALID_PASSWORD_FORMAT);

    const org = await orgService.createOrganization({
      organization_name,
      email,
      password,
    });

    res.status(201).json({
      message: "Organization Created Successfully!",
      data: org,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getOrg = async (req, res) => {
  try {
    const { organization_name } = req.body;

    if (!organization_name) return res.status(400).json(ERR.INVALID_ORG_NAME);

    const org = await orgService.getOrganization(organization_name);

    res.json(org);
  } catch (err) {
    res.status(404).json(err);
  }
};

exports.updateOrg = async (req, res) => {
  try {
    const { new_organization_name, email, password } = req.body;

    if (!new_organization_name)
      return res.status(400).json(ERR.INVALID_ORG_NAME);

    const org = await orgService.updateOrganization({
      new_organization_name,
      email,
      password,
    });

    res.json({ message: "Organization updated", org });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await orgService.loginAdmin({ email, password });

    res.json({ message: "Login success", token: result.token });
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.deleteOrg = async (req, res) => {
  try {
    const { organization_name } = req.body;

    const deleted = await orgService.deleteOrganization(organization_name);

    res.json({ message: "Organization deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
};
