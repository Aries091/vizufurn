import { Router } from 'express';
import { deleteProduct, publishProduct } from '../controllers/product.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/publishProduct')
    .post(
        // verifyJWT,
        upload.fields([
            { name: 'displayImage', maxCount: 1 },
            { name: 'modelImage', maxCount: 1 }
        ]),
        publishProduct
    );
    router.route('/:productId').delete(deleteProduct);

export default router;