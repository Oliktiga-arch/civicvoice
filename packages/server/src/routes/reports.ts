import express, { Request, Response } from 'express';
import multer from 'multer';
import { z } from 'zod';
import Report from '../models/Report';
import Comment from '../models/Comment';
import { protect, authorize } from '../middleware/auth';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../services/cloudinary';
import { emitNewReport } from '../services/socket';

const router = express.Router();

// Multer configuration for memory storage (for Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Validation schemas
const createReportSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  category: z.string().min(1),
  latitude: z.string().transform(val => parseFloat(val)).refine(val => val >= -90 && val <= 90),
  longitude: z.string().transform(val => parseFloat(val)).refine(val => val >= -180 && val <= 180),
  anonymous: z.string().transform(val => val === 'true'),
});

const updateReportSchema = z.object({
  status: z.enum(['pending', 'assigned', 'in-progress', 'resolved', 'closed']).optional(),
  assignedTo: z.string().optional(),
});

/**
 * @route POST /api/v1/reports
 * @desc Create a new report
 * @access Public (citizens can report anonymously)
 */
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, description, category, latitude, longitude, anonymous } = createReportSchema.parse(req.body);

    let imageUrl: string | undefined;
    // TODO: Implement Cloudinary upload
    // if (req.file) {
    //   const result = await uploadToCloudinary(req.file.buffer);
    //   imageUrl = result.secure_url;
    // }

    const reportData: any = {
      title,
      description,
      category,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      image: imageUrl,
      anonymous: anonymous || false,
    };

    // If user is authenticated and not anonymous, attach user
    if (req.user && !anonymous) {
      reportData.user = (req.user as any).id;
    }

    const report = await Report.create(reportData);

    // Emit socket event for new report (to mediators)
    emitNewReport(report);

    res.status(201).json({
      success: true,
      data: { report },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/**
 * @route GET /api/v1/reports
 * @desc Get reports within 10km radius (anonymized for public)
 * @access Public
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { lat, lng, limit = 50 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const limitNum = Math.min(parseInt(limit as string), 100);

    const reports = await Report.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance',
          maxDistance: 10000, // 10km in meters
          spherical: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $addFields: {
          user: {
            $cond: {
              if: { $eq: ['$anonymous', true] },
              then: null,
              else: { $arrayElemAt: ['$user', 0] },
            },
          },
        },
      },
      {
        $project: {
          'user.password': 0,
          'user.email': 0,
          'user.avatar': 0,
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limitNum },
    ]);

    res.json({
      success: true,
      data: { reports },
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/**
 * @route GET /api/v1/reports/my
 * @desc Get user's own reports
 * @access Private
 */
router.get('/my', protect, async (req: Request, res: Response) => {
  try {
    const reports = await Report.find({ user: (req.user as any).id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { reports },
    });
  } catch (error) {
    console.error('Get my reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/**
 * @route PATCH /api/v1/reports/:id
 * @desc Update report (mediator: assign, status update)
 * @access Private (mediator)
 */
router.patch('/:id', protect, authorize('mediator', 'admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = updateReportSchema.parse(req.body);

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const report = await Report.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.json({
      success: true,
      data: { report },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Update report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

export default router;