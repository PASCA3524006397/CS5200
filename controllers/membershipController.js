// controllers/membershipController.js

const db = require('../db');
const { validationResult } = require('express-validator');

// Create a new membership record
exports.createMembershipRecord = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, last_payment_date, amount_paid, payment_method, monthly_fee, status } = req.body;

  // Check if member exists
  const memberSql = 'SELECT * FROM members WHERE name = ?';
  db.query(memberSql, [name], (err, memberResults) => {
    if (err) {
      console.error('Error checking member:', err);
      res.status(500).send('Server Error');
    } else if (memberResults.length === 0) {
      res.status(400).send('Member does not exist');
    } else {
      // Insert membership record
      const membershipSql = 'INSERT INTO membership SET ?';
      const membershipData = { name, last_payment_date, amount_paid, payment_method, monthly_fee, status };
      db.query(membershipSql, membershipData, (err, result) => {
        if (err) {
          console.error('Error adding membership record:', err);
          if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).send('Membership record already exists for this member');
          } else {
            res.status(500).send('Server Error');
          }
        } else {
          res.status(201).json(membershipData);
        }
      });
    }
  });
};

// Get all membership records
exports.getAllMembershipRecords = (req, res) => {
  const sql = 'SELECT * FROM membership';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching membership records:', err);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
};

// Get membership record for a member
exports.getMembershipByMember = (req, res) => {
  const memberName = req.params.name;
  const sql = 'SELECT * FROM membership WHERE name = ?';

  db.query(sql, [memberName], (err, results) => {
    if (err) {
      console.error('Error fetching membership record:', err);
      res.status(500).send('Server Error');
    } else if (results.length === 0) {
      res.status(404).send('Membership record not found');
    } else {
      res.json(results[0]);
    }
  });
};

// Update a membership record
exports.updateMembershipRecord = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const memberName = req.params.name;
  const updatedRecord = req.body;

  const sql = 'UPDATE membership SET ? WHERE name = ?';

  db.query(sql, [updatedRecord, memberName], (err, result) => {
    if (err) {
      console.error('Error updating membership record:', err);
      res.status(500).send('Server Error');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Membership record not found');
    } else {
      res.json({ name: memberName, ...updatedRecord });
    }
  });
};

// Delete a membership record
exports.deleteMembershipRecord = (req, res) => {
  const memberName = req.params.name;

  const sql = 'DELETE FROM membership WHERE name = ?';

  db.query(sql, [memberName], (err, result) => {
    if (err) {
      console.error('Error deleting membership record:', err);
      res.status(500).send('Server Error');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Membership record not found');
    } else {
      res.json({ message: 'Membership record deleted', name: memberName });
    }
  });
};
