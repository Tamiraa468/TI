import dotenv from 'dotenv';
import colors from 'colors'; // ✅ Add this line
import users from './data/users.js';
import companies from './data/companies.js';
import User from './models/userModel.js';
import Company from './models/companyModel.js';
import connectDB from './config/db.js';


dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Company.deleteMany();

    const createdUsers = await User.insertMany(users);
    const createdCompanies = await Company.insertMany(companies);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Company.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
