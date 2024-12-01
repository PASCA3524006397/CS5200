// controllers/attendanceController.js

const db = require('../db');
const { validationResult } = require('express-validator');

// Create a new attendance record
exports.createAttendanceRecord = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, check_in_date, attendance, absent_reason } = req.body;

  // Check if member exists
  const memberSql = 'SELECT * FROM members WHERE name = ?';
  db.query(memberSql, [name], (err, memberResults) => {
    if (err) {
      console.error('Error checking member:', err);
      res.status(500).send('Server Error');
    } else if (memberResults.length === 0) {
      res.status(400).send('Member does not exist');
    } else {
      // Insert attendance record
      const attendanceSql = 'INSERT INTO attendance SET ?';
      const attendanceData = { name, check_in_date, attendance, absent_reason };
      db.query(attendanceSql, attendanceData, (err, result) => {
        if (err) {
          console.error('Error adding attendance record:', err);
          if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).send('Attendance record already exists for this member on this date');
          } else {
            res.status(500).send('Server Error');
          }
        } else {
          res.status(201).json(attendanceData);
        }
      });
    }
  });
};

// Get all attendance records
exports.getAllAttendanceRecords = (req, res) => {
  const sql = 'SELECT * FROM attendance';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching attendance records:', err);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
};

// Get attendance records for a member
exports.getAttendanceByMember = (req, res) => {
  const memberName = req.params.name;
  const sql = 'SELECT * FROM attendance WHERE name = ?';

  db.query(sql, [memberName], (err, results) => {
    if (err) {
      console.error('Error fetching attendance records:', err);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
};

// Update an attendance record
exports.updateAttendanceRecord = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, check_in_date } = req.params;
  const updatedRecord = req.body;

  const sql = 'UPDATE attendance SET ? WHERE name = ? AND check_in_date = ?';

  db.query(sql, [updatedRecord, name, check_in_date], (err, result) => {
    if (err) {
      console.error('Error updating attendance record:', err);
      res.status(500).send('Server Error');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Attendance record not found');
    } else {
      res.json({ name, check_in_date, ...updatedRecord });
    }
  });
};

// Delete an attendance record
exports.deleteAttendanceRecord = (req, res) => {
  const { name, check_in_date } = req.params;

  const sql = 'DELETE FROM attendance WHERE name = ? AND check_in_date = ?';

  db.query(sql, [name, check_in_date], (err, result) => {
    if (err) {
      console.error('Error deleting attendance record:', err);
      res.status(500).send('Server Error');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Attendance record not found');
    } else {
      res.json({ message: 'Attendance record deleted', name, check_in_date });
    }
  });
};
