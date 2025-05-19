import Employ from '../models/employeeModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { CLIENT_RENEG_LIMIT } from 'tls';

// List all employees
export const list = asyncHandler(async (req, res) => {
  const employees = await Employ.find(); 
  if (employees.length > 0) {
    res.json({ items: employees }); 
  } else {
    res.status(404).json({ message: "No employees found", items: [employees] }); 
  }
});


// Register a new employee (Create)
export const register = asyncHandler(async (req, res) => {
  const {
    last_name,
    first_name,
    gender,
    age,
    email,
    phone,
    password,
    role_name,
  } = req.body;

  // Validate required fields
  if (
    !last_name ||
    !first_name ||
    !gender ||
    !age ||
    !email ||
    !phone ||
    !password ||
    !role_name
  ) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  // Check if employee already exists by email
  const existingEmployee = await Employ.findOne({ email });
  if (existingEmployee) {
    res.status(400).json({ message: "Employee already exists" });
    return;
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new employee
  const newEmployee = new Employ({
    last_name,
    first_name,
    gender,
    age,
    email,
    phone,
    password: hashedPassword,
    role_name,
  });

  await newEmployee.save();

  res.status(201).json({
    message: "Employee registered successfully",
    employee: {
      id: newEmployee._id,
      full_name: `${newEmployee.first_name} ${newEmployee.last_name}`,
      email: newEmployee.email,
      phone: newEmployee.phone,
      role: newEmployee.role_name,
    },
  });
});


export const update = asyncHandler(async (req, res) => {
    // const company = await Company.findById(req.params.id);

  const { id } = req.params; // Get employee ID from the request params
  const { age, first_name, last_name, gender, phone, email, role_name } = req.body;

  

  console.log("body:", req.body);
    console.log("id:", req.params);


 
  // Find employee by ID
  const employee = await Employ.findById(id);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  // Check if the email is already used by another employee
  if (email && email !== employee.email) {
    const existingEmployee = await Employ.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already in use by another employee" });
    }
  }

  // Update fields
  employee.first_name = first_name || employee.first_name;
  employee.last_name = last_name || employee.last_name;
  employee.gender = gender || employee.gender;
  employee.age = age || employee.age;
  employee.phone = phone || employee.phone;
  employee.email = email || employee.email;
  employee.role_name = role_name || employee.role_name;

  const c =  await employee.save();

  console.log("c:", c);

  res.json({
    message: "Employee updated successfully",
    employee: {
      id: employee._id,
      full_name: `${employee.first_name} ${employee.last_name}`,
      email: employee.email,
      phone: employee.phone,
      gender: employee.gender,
      age: employee.age,
      role: employee.role_name,
    },
  });
});



// Delete an employee (Delete)
export const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get employee ID from the request params

  // Find the employee by ID (without lean() to retain document methods)
  const employee = await Employ.findById(id);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  // Use deleteOne instead of remove
  await employee.deleteOne();

  res.json({ message: "Employee deleted successfully" });
});


// Change password for an employee

 export const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid employee ID format" });
  }

  try {
    const employee = await Employ.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    employee.password = password || employee.password;

    const updatedEmployee = await employee.save();
    res.json({ success: true, data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});