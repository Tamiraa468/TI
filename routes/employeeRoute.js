import express from "express";
import { list, register, update, deleteEmployee, changePassword } from "../controllers/employeeController.js";

const router = express.Router();

// List all employees
router.route("/").get(list);

// Register a new employee (Create)
router.route("/register").post(register);

// Update an existing employee (Update)
router.route("/update/:id").put(update);

// Delete an employee (Delete)
router.route("/delete/:id").delete(deleteEmployee);

router.route("/changePassword/:id").put(changePassword);

export default router;
