import Company from "../models/companyModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
  const companies = await Company.find();
  if(companies.length > 0) {
    res.json({ items: companies });
  }else{
    res.status(404).json({ message: "No companies found", items: companies });
  }
});


export const create = asyncHandler(async (req, res) => {
  const {
    shortcut_name,
    name,
    is_broker = false,
    contact_number,
    ledger_id,
    created_by,
    user,
    ledger,
  } = req.body;

  // Extract nested values safely
  const created_by_name = created_by?.name;
  const email = user?.email;
  const ledger_name = ledger?.name;
  const ledger_balance = ledger?.balance;

  // Validate required fields
  if (
    !shortcut_name ||
    !name ||
    !ledger_id ||
    !created_by_name ||
    !contact_number ||
    !email ||
    !ledger_name ||
    ledger_balance === undefined
  ) {
    res.status(400);
    throw new Error("All required fields must be provided.");
  }

  // Check for existing company
  const existingCompany = await Company.findOne({ name });
  if (existingCompany) {
    res.status(400);
    throw new Error("A company with this name already exists.");
  }

  const existingEmail = await Company.findOne({ "user.email": email });
  if (existingEmail) {
    res.status(400);
    throw new Error("A company with this email already exists.");
  }

  // Create company document
  const company = new Company({
    shortcut_name,
    name,
    is_broker,
    contact_number,
    ledger_id,
    created_by: { name: created_by_name },
    user: { email },
    ledger: { name: ledger_name, balance: ledger_balance },
  });

  const createdCompany = await company.save();

  res.status(201).json({
    message: "Customer company created successfully",
    data: createdCompany,
  });
});


export const getById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (company) {
    res.json(company);
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

export const update = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (company) {
    company.id = req.body.id || company.id;
    company.abbreviation = req.body.abbreviation || company.abbreviation;
    company.companyName = req.body.companyName || company.companyName;
    company.isBroker = req.body.isBroker || company.isBroker;
    company.customerCode = req.body.customerCode || company.customerCode;
    company.accountNumber = req.body.accountNumber || company.accountNumber;
    company.email = req.body.email || company.email;

    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

export const remove = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (company) {
    await company.deleteOne();
    res.json({ message: 'Company removed' });
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});