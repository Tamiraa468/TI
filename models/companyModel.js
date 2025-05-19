import mongoose from 'mongoose';

const companySchema = mongoose.Schema(
  {
    shortcut_name: {
      type: String,
      required: true,
    },
    created_by: {
      name: {
        type: String,
        required: true,
      },
    },
    name: {
      type: String,
      required: true,
    },
    is_broker: {
      type: Boolean,
      default: false,
    },
    ledger_id: {
      type: Number,
      required: true,
    },
    user: {
      email: {
        type: String,
        required: true,
      },
    },
    ledger: {
      name: {
        type: String,
        required: true,
      },
      balance: {
        type: Number,
        required: true,
      },
    },
    contact_number: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;