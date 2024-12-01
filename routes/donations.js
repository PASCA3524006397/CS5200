// routes/donations.js

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const donationsController = require('../controllers/donationsController');

// Create a new donation
router.post(
  '/',
  [
    body('donor_name')
      .notEmpty().withMessage('Donor name is required')
      .isLength({ max: 255 }).withMessage('Donor name must be at most 255 characters'),
    body('donation')
      .notEmpty().withMessage('Donation amount is required')
      .isDecimal().withMessage('Donation must be a decimal number'),
    body('address')
      .optional()
      .isLength({ max: 200 }).withMessage('Address must be at most 200 characters'),
    body('email')
      .optional()
      .isEmail().withMessage('Valid email is required')
      .isLength({ max: 100 }).withMessage('Email must be at most 100 characters'),
    body('on_donor_list')
      .optional()
      .isBoolean().withMessage('On donor list must be a boolean value'),
    body('acknowledged')
      .optional()
      .isBoolean().withMessage('Acknowledged must be a boolean value'),
    body('notes')
      .optional()
      .isLength({ max: 65535 }).withMessage('Notes must be at most 65535 characters'),
  ],
  donationsController.createDonation
);

// Get all donations
router.get('/', donationsController.getAllDonations);

// Get donations by donor name
router.get('/:donor_name', donationsController.getDonationsByDonor);

// Update a donation
router.put(
  '/:donor_name/:donation',
  [
    param('donor_name')
      .notEmpty().withMessage('Donor name is required')
      .isLength({ max: 255 }).withMessage('Donor name must be at most 255 characters'),
    param('donation')
      .notEmpty().withMessage('Donation amount is required')
      .isDecimal().withMessage('Donation must be a decimal number'),
    body('address')
      .optional()
      .isLength({ max: 200 }).withMessage('Address must be at most 200 characters'),
    body('email')
      .optional()
      .isEmail().withMessage('Valid email is required')
      .isLength({ max: 100 }).withMessage('Email must be at most 100 characters'),
    body('on_donor_list')
      .optional()
      .isBoolean().withMessage('On donor list must be a boolean value'),
    body('acknowledged')
      .optional()
      .isBoolean().withMessage('Acknowledged must be a boolean value'),
    body('notes')
      .optional()
      .isLength({ max: 65535 }).withMessage('Notes must be at most 65535 characters'),
  ],
  donationsController.updateDonation
);

// Delete a donation
router.delete('/:donor_name/:donation', donationsController.deleteDonation);

module.exports = router;
