import express from 'express';
import {
  list,
  create,
  getById,
  update,
  remove,
} from '../controllers/companyController.js';

const router = express.Router();

// Route: /api/companies
router.route('/')
  .get(list)         // GET all companies
  .post(create);     // POST a new company

// Route: /api/companies/:id
router.route('/:id')
  .get(getById)      // GET company by ID
  .put(update)       // PUT update company
  .delete(remove);   // DELETE company

export default router;
