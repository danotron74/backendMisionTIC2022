const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../database/db.js");
// Load input validation
const validateRegisterInput = require("../../validation/userRegister.js");
const validateLoginInput = require("../../validation/userLogin.js");
// Load User model

const Contratos = require("../../models/contratos.js")

const auth = require('../../middleware/auth.js')
// @route POST api/users/register
// @desc Register user
// @access Public
router.get("/list",auth.verifyUsuario, async(req,res,next) => {
    try {
        const reg = await Contratos.find({estado:true });
        res.status(200).json(reg)
    } catch (e) {
        res.status(500).send({
            message: 'Ocurrió un error'+e
        });
        next(e);
    }
});

router.post("/create",auth.verifyUsuario, async(req,res,next) => {
    try {
        console.log(req.body )
        const newContrato = await new Contratos(req.body).save()
        .catch(err => console.log(err));
        res.status(200).json(newContrato)
    } catch (e) {
        res.status(500).send({
            message: 'Ocurrió un error '+e
        });
        next(e);
    }
});


router.post("/update",auth.verifyUsuario, async(req,res,next) => {
    try {
        // console.log(req.body )
        const updateContrato = await Contratos.findByIdAndUpdate(req.body.id,req.body)
        .catch(err => console.log(err));
        res.status(200).json(await Contratos.findById(req.body.id))
    } catch (e) {
        res.status(500).send({
            message: 'Ocurrió un error '+e
        });
        next(e);
    }
});

router.post("/changeEstado",auth.verifyUsuario, async(req,res,next) => {
    try {
        const actual = await Contratos.findById(req.body.id).exec();
        if (actual.estado){
            const updateContrato = await Contratos.findByIdAndUpdate(req.body.id,{estado: false})
            .catch(err => console.log(err));
            res.status(200).json(await Contratos.findById(req.body.id))
        } else {
            const updateContrato = await Contratos.findByIdAndUpdate(req.body.id,{estado: true})
            .catch(err => console.log(err));
            res.status(200).json(await Contratos.findById(req.body.id))
        }
        // console.log(req.body )
    } catch (e) {
        res.status(500).send({
            message: 'Ocurrió un error '+e
        });
        next(e);
    }
});


router.post("/delete",auth.verifyUsuario, async(req,res,next) => {
    try {
        // console.log(req.body )
        const updateContrato = await Contratos.findByIdAndDelete(req.body.id)
        .catch(err => console.log(err));
        res.status(200).json(await Contratos.findById(req.body.id))
    } catch (e) {
        res.status(500).send({
            message: 'Ocurrió un error '+e
        });
        next(e);
    }
});


// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login",auth.verifyUsuario, async(req, res, next) => {
    try {
        // Form validation
        const { errors, isValid } = validateLoginInput(req.body);
        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        const email = req.body.email;
        const password = req.body.password;
        // Find user by email
        await User.findOne({ email }).then(user => {
            // Check if user exists
            if (!user) {
                return res.status(404).json({ emailnotfound: "Email not found" });
            }
            // Check password
            bcrypt.compare(password, user.password).then(isMatch => {
                18
                if (isMatch) {
                    // User matched
                    // Create JWT Payload
                    const payload = {
                        id: user.id,
                        name: user.name
                    };
                    // Sign token
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {
                        expiresIn: 31556926 // 1 year in seconds
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        }
                    );
                } else {
                    return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
                }
            });
        });
    } catch(e) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(e);
    }
});
module.exports = router;