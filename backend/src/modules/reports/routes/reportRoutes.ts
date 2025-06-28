import { Router } from 'express';
import { container } from '../../../container';
import { TYPES } from '../../../types';
import { ReportController } from '../controllers/ReportController';
import { authenticate } from '../../auth/middleware/authenticate';
import { authorize } from '../../auth/middleware/authorize';
import {IReportService} from "../services/IReportService";

const router = Router();
const reportService = container.get<IReportService>(TYPES.IReportService);
const reportController = new ReportController(reportService);

// Apply authentication middleware to all routes
router.use(authenticate);
router.use(authorize(['admin']));

router.get('/', (req, res) => reportController.getAllReports(req, res));

router.get('/dashboard', (req, res) => reportController.getDashboardStats(req, res));

router.get('/type/:type', (req, res) => reportController.getReportsByType(req, res));

router.get('/:id', (req, res) => reportController.getReportById(req, res));

router.post('/', (req, res) => reportController.createReport(req, res));

router.put('/:id', (req, res) => reportController.updateReport(req, res));

router.delete('/:id', (req, res) => reportController.deleteReport(req, res));

router.post('/generate/sales', (req, res) => reportController.generateSalesReport(req, res));
router.post('/generate/users', (req, res) => reportController.generateUserReport(req, res));
router.post('/generate/products', (req, res) => reportController.generateProductReport(req, res));
router.post('/generate/orders', (req, res) => reportController.generateOrderReport(req, res));
router.post('/generate/revenue', (req, res) => reportController.generateRevenueReport(req, res));
router.post('/generate/inventory', (req, res) => reportController.generateInventoryReport(req, res));
router.post('/generate/financial', (req, res) => reportController.generateFinancialReport(req, res));
router.post('/generate/reviews', (req, res) => reportController.generateReviewReport(req, res));

router.get('/:id/export', (req, res) => reportController.exportReport(req, res));

export default router;
