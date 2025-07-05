import express from 'express'
// import jwt from 'jsonwebtoken'
// import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

import User from '../models/User.js'

const router = express.Router();

router.post('/signup', async(req, res)=>{
    try{
        const {username, email, password} = req.body;

        const hashedPass = await bcrypt.hash(password, 10)
        const user = await User.create({username, email, password: hashedPass})
        res.status(201).json({message: 'User craeted successfully'});
    } catch(err){
        console.error(err || err.message);
        res.status(500).json({error: 'Signup failed'});
    }
});

export default router;


