import express from 'express';
import Report from '../models/Report';
import Resolution from '../models/Resolution';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @route GET /api/v1/mediator/dashboard
 * @desc Get mediator dashboard with assigned reports and stats
 * @access Private (mediator, admin)
 */
router.get('/dashboard', protect, authorize('mediator', 'admin'), async (req, res) => {
  try {
    const mediatorId = req.user.id;

    // Get assigned reports
    const assignedReports = await Report.find({ assignedTo: mediatorId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    // Get stats
    const stats = await Report.aggregate([
      { $match: { assignedTo: mediatorId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get resolutions count
    const resolutionsCount = await Resolution.countDocuments({ mediator: mediatorId });

    // Format stats
    const statusStats = {
      pending: 0,
      assigned: 0,
      'in-progress': 0,
      resolved: 0,
      closed: 0,
    };

    stats.forEach((stat) => {
      statusStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        assignedReports,
        stats: {
          ...statusStats,
          totalAssigned: assignedReports.length,
          resolutions: resolutionsCount,
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

export default router;