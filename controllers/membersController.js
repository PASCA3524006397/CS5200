/// controllers/membersController.js

const db = require('../db');
const { validationResult } = require('express-validator');

// Create a new member
exports.createMember = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const newMember = req.body;
  
  const sql = 'INSERT INTO members SET ?';
  
  db.query(sql, newMember, (err, result) => {
    if (err) {
      console.error('Error adding member:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).send('Member with this name or email already exists');
      } else {
        res.status(500).send('Server Error');
      }
    } else {
      res.status(201).json({ name: newMember.name, ...newMember });
    }
  });
};

// Get all members
exports.getAllMembers = (req, res) => {
  const sql = 'SELECT * FROM members';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching members:', err);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
};

// Get a member by name
exports.getMemberByName = (req, res) => {
  const sql = 'SELECT * FROM members WHERE name = ?';
  const memberName = req.params.name;
  
  db.query(sql, [memberName], (err, results) => {
    if (err) {
      console.error('Error fetching member:', err);
      res.status(500).send('Server Error');
    } else if (results.length === 0) {
      res.status(404).send('Member not found');
    } else {
      res.json(results[0]);
    }
  });
};

// Update a member
exports.updateMember = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const updatedMember = req.body;
  const memberName = req.params.name;
  
  const sql = 'UPDATE members SET ? WHERE name = ?';
  
  db.query(sql, [updatedMember, memberName], (err, result) => {
    if (err) {
      console.error('Error updating member:', err);
      res.status(500).send('Server Error');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Member not found');
    } else {
      res.json({ name: memberName, ...updatedMember });
    }
  });
};

// Delete a member
exports.deleteMember = (req, res) => {
  const memberName = req.params.name;

  // Delete related attendance records
  const deleteAttendanceSql = 'DELETE FROM attendance WHERE name = ?';
  db.query(deleteAttendanceSql, [memberName], (err, result) => {
    if (err) {
      console.error('Error deleting attendance records:', err);
      res.status(500).send('Server Error');
    } else {
      // Delete related membership records
      const deleteMembershipSql = 'DELETE FROM membership WHERE name = ?';
      db.query(deleteMembershipSql, [memberName], (err, result) => {
        if (err) {
          console.error('Error deleting membership records:', err);
          res.status(500).send('Server Error');
        } else {
          // Delete member record
          const deleteMemberSql = 'DELETE FROM members WHERE name = ?';
          db.query(deleteMemberSql, [memberName], (err, result) => {
            if (err) {
              console.error('Error deleting member:', err);
              res.status(500).send('Server Error');
            } else if (result.affectedRows === 0) {
              res.status(404).send('Member not found');
            } else {
              res.json({ message: 'Member and related records deleted', name: memberName });
            }
          });
        }
      });
    }
  });
};

