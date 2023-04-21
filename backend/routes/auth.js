const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = "asdfghjkl;234567";

//Create a User using: POST "/api/auth/createuser". No login required 
router.post('/createuser', [
    body('name', 'Enter  valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email-id').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 8 }),
], async (req, res) => {
    let success = false;
    // if there are errors then return bad requests
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // check whether user with this email exit
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ success, error: "User already existed with this mail-id" })
        }

        // hashing of password
        const salt = bcrypt.genSaltSync(10);
        const secPass = bcrypt.hashSync(req.body.password, salt);

        // create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user: {
                id: user.id,
            },
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    }

    // catch if error has occured
    catch (error) {
        res.status(500).send("Internal error has occured");
    }

})

// create a login using :Post "/api/auth/login" login required
router.post('/login', [
    body('email', 'Enter a valid email-id').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    let success = false;
    // if there are errors then return bad requests
    const errors = validationResult(req);
    // console.log(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // destructuring req
    const { email, password } = req.body;

    try {
        // checking for correct email-id in database
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({ success, error: "Invalid User credentials" });
        }

        // checking for correct password
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(500).json({ success, error: "Invalid User credentials" });
        }

        const data = {
            user: {
                id: user.id,
            },
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    }

    // catch if error has occured
    catch (error) {
        res.status(500).send("Internal error has occured");
    }

})

// fetching a logedin user data :Post "/api/auth/getdata" login required
router.post('/getdata', fetchUser, async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    }

    // catch if error has occured
    catch (error) {
        res.status(500).send("Internal error has occured");
    }

})



module.exports = router;