// controllers/donationsController.js

const db = require('../db');
const { validationResult } = require('express-validator');

// Create a new donation
exports.createDonation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { donor_name, address, email, donation, on_donor_list, acknowledged, notes } = req.body;

  const sql = 'INSERT INTO donations SET ?';
  const donationData = { donor_name, address, email, donation, on_donor_list, acknowledged, notes };

  db.query(sql, donationData, (err, result) => {
    if (err) {
      console.error('Error adding donation:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).send('Donation record already exists for this donor and amount');
      } else {
        res.status(500).send('Server Error');
      }
    } else {
      res.status(201).json(donationData);
    }
  });
};

// Get all donations
exports.getAllDonations = (req, res) => {
  const sql = 'SELECT * FROM donations';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching donations:', err);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
};

// Get donations by donor name
exports.getDonationsByDonor = (req, res) => {
  const donorName = req.params.donor_name;
  const sql = 'SELECT * FROM donations WHERE donor_name = ?';

  db.query(sql, [donorName], (err, results) => {
    if (err) {
      console.error('Error fetching donations:', err);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
};

// Update a donation
exports.updateDonation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { donor_name, donation } = req.params;
  const updatedDonation = req.body;

  const sql = 'UPDATE donations SET ? WHERE donor_name = ? AND donation = ?';

  db.query(sql, [updatedDonation, donor_name, donation], (err, result) => {
    if (err) {
      console.error('Error updating donation:', err);
      res.status(500).send('Server Error');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Donation not found');
    } else {
      res.json({ donor_name, donation, ...updatedDonation });
    }
  });
};

// Delete a donation
exports.deleteDonation = (req, res) => {
  const { donor_name, donation } = req.params;

  const sql = 'DELETE FROM donations WHERE donor_name = ? AND donation = ?';

  db.query(sql, [donor_name, donation], (err, result) => {
    if (err) {
      console.error('Error deleting donation:', err);
      res.status(500).send('Server Error');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Donation not found');
    } else {
      res.json({ message: 'Donation deleted', donor_name, donation });
    }
  });
};
