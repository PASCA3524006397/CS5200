// routes/membership.js

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const membershipController = require('../controllers/membershipController');

// Create a new membership record
router.post(
  '/',
  [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 10 }).withMessage('Name must be at most 10 characters'),
    body('last_payment_date')
      .optional()
      .isISO8601().withMessage('Last payment date must be a valid date'),
    body('amount_paid')
      .optional()
      .isDecimal().withMessage('Amount paid must be a decimal number'),
    body('payment_method')
      .optional()
      .isLength({ max: 50 }).withMessage('Payment method must be at most 50 characters'),
    body('monthly_fee')
      .optional()
      .isDecimal().withMessage('Monthly fee must be a decimal number'),
    body('status')
      .optional()
      .isBoolean().withMessage('Status must be a boolean value'),
  ],
  membershipController.createMembershipRecord
);

// Get all membership records
router.get('/', membershipController.getAllMembershipRecords);

// Get membership record for a member
router.get('/:name', membershipController.getMembershipByMember);

// Update a membership record
router.put(
  '/:name',
  [
    param('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 10 }).withMessage('Name must be at most 10 characters'),
    body('last_payment_date')
      .optional()
      .isISO8601().withMessage('Last payment date must be a valid date'),
    body('amount_paid')
      .optional()
      .isDecimal().withMessage('Amount paid must be a decimal number'),
    body('payment_method')
      .optional()
      .isLength({ max: 50 }).withMessage('Payment method must be at most 50 characters'),
    body('monthly_fee')
      .optional()
      .isDecimal().withMessage('Monthly fee must be a decimal number'),
    body('status')
      .optional()
      .isBoolean().withMessage('Status must be a boolean value'),
  ],
  membershipController.updateMembershipRecord
);

// Delete a membership record
router.delete('/:name', membershipController.deleteMembershipRecord);

module.exports = router;
