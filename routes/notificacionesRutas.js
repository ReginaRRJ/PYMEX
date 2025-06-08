import { verifyToken } from '../controllers/authMiddle.js';

const router = express.Router();

router.use(verifyToken);