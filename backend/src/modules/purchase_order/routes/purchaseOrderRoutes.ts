import { Router } from 'express';
import { PurchaseOrderController } from '../controllers/PurchaseOrderController';
import { authenticate } from '../../auth/middleware/authenticate';
import { authorize } from '../../auth/middleware/authorize';
import { container } from "../../../container";
import { IPurchaseOrderService } from "../services/IPurchaseOrderService";
import { TYPES } from "../../../types";

export const purchaseOrderRouter = (): Router => {
  const router = Router();
  const purchaseOrderService = container.get<IPurchaseOrderService>(TYPES.IPurchaseOrderService);
  const purchaseOrderController = new PurchaseOrderController(purchaseOrderService);

  // Apply authentication middleware to all routes
  router.use(authenticate);

  // Apply authorization middleware - only admins can access purchase orders
  router.use(authorize(['admin']));

  // Purchase Order CRUD routes
  router.post('/', (req, res) => purchaseOrderController.createPurchaseOrder(req, res));
  
  router.get('/', (req, res) => purchaseOrderController.getPurchaseOrders(req, res));
  
  router.get('/:id', (req, res) => purchaseOrderController.getPurchaseOrderById(req, res));
  
  router.put('/:id', (req, res) => purchaseOrderController.updatePurchaseOrder(req, res));
  
  router.delete('/:id', (req, res) => purchaseOrderController.deletePurchaseOrder(req, res));

  // Status management route
  router.patch('/:id/status', (req, res) => purchaseOrderController.updatePurchaseOrderStatus(req, res));

  return router;
};

export default purchaseOrderRouter;
