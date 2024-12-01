// routes/attendance.js

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const attendanceController = require('../controllers/attendanceController');

// Create a new attendance record
router.post(
  '/',
  [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 10 }).withMessage('Name must be at most 10 characters'),
    body('check_in_date')
      .notEmpty().withMessage('Check-in date is required')
      .isISO8601().withMessage('Check-in date must be a valid date'),
    body('attendance')
      .optional()
      .isBoolean().withMessage('Attendance must be a boolean value'),
    body('absent_reason')
      .optional()
      .isLength({ max: 255 }).withMessage('Absent reason must be at most 255 characters'),
  ],
  attendanceController.createAttendanceRecord
);

// Get all attendance records
router.get('/', attendanceController.getAllAttendanceRecords);

// Get attendance records for a member
router.get('/:name', attendanceController.getAttendanceByMember);

// Update an attendance record
router.put(
  '/:name/:check_in_date',
  [
    param('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 10 }).withMessage('Name must be at most 10 characters'),
    param('check_in_date')
      .notEmpty().withMessage('Check-in date is required')
      .isISO8601().withMessage('Check-in date must be a valid date'),
    body('attendance')
      .optional()
      .isBoolean().withMessage('Attendance must be a boolean value'),
    body('absent_reason')
      .optional()
      .isLength({ max: 255 }).withMessage('Absent reason must be at most 255 characters'),
  ],
  attendanceController.updateAttendanceRecord
);

// Delete an attendance record
router.delete('/:name/:check_in_date', attendanceController.deleteAttendanceRecord);

module.exports = router;
