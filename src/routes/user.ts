import express from 'express';

import {
  searchUserDni
} from '../controllers/user.controller';

const router = express.Router();

router.post('/search-user-dni');

export default router