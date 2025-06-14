import { Router } from 'express';
import { body } from 'express-validator';
const router = Router()
import { registerUser, loginUser,getUserProfile, logoutUser } from '../controller/user.controller.js';
import { verifyJWT } from "../middleware/auth.middleware.js";

router.route('/register').post(
    [
        body('name').isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
        body('phone').matches(/^\d{10}$/).withMessage("Phone number must be 10 digits"),
        body('email').isEmail().withMessage("Invalid Email"),
        body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body('company').notEmpty().withMessage("Company name is required"),
        body('isAgency').isIn(['yes', 'no']).withMessage("isAgency must be 'yes' or 'no'")
    ],
    registerUser
)

router.route('/login').post(
    [
        body('email').isEmail().withMessage("Invalid Email"),
        body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    ],
    loginUser
)

router.route('/profile').get(verifyJWT,getUserProfile)

router.route('/logout').post(verifyJWT,logoutUser)

export default router