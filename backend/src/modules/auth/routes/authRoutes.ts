import {TYPES} from "../../../types";
import {container} from "../../../container";
import {AuthController} from "../controllers/AuthController";
import {IAuthService} from "../services/IAuthService";
import express from "express";
import {authenticate} from "../middleware/authenticate";


const authRouter = ()=>{
    const router = express.Router();
    const authService =container.get<IAuthService>(TYPES.IAuthService);
    const authController = new AuthController(authService)
    router.get("/ping", async (req, res) => {
        res.send("pong");
    })
// Register a new user
    router.post('/register', (req, res) => authController.register(req, res));

// Login
    router.post('/login', (req, res) => authController.login(req, res));

// Get user profile (protected route)
    router.use(authenticate);

    router.get('/profile' ,(req, res) => authController.getProfile(req, res));

    router.get('/logout',  ()=>{console.log('logout')});

    return router;
}

export default authRouter;