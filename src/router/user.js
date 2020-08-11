const express = require("express");
const sharp=require("sharp");
const router = new express.Router();
const User = require("../models/User");
const Auth = require("../middleware/Auth");
const multer = require("multer");
const {WelcomEmail,GoodByeEmail} = require("../email/acount");

// router.get("/test",(req,res)=>{
//     res.send("<h1>Helooooo form New FOLE !<h1>")
// })
//////////////////Create Users ////////////////
router.post("/users", async (req, res) => {

    const user = new User(req.body);
    try {
        const use = await user.save();
        const token = await use.generateAuthToken();
        WelcomEmail(use.email,use.name);
        res.status(201).send({ use, token });
    } catch (e) {
        res.status(400).send(e);
    }
});
//////////////////Login User ///////////////

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.login(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token })
    } catch (e) {
        res.status(404).send(e)
    }
})

//////////////////LogOut User ///////////////
router.post("/users/logout", Auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save();
        res.send("Your LogOut !('_')")
    } catch (e) {
        res.status(505).send();
    }

})
////////////lOGout All /////////////
router.post("/users/logoutAll", Auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send("Your LogOut All!('_')")

    } catch (e) {
        res.status(505).send()

    }
})

/////////////////////Read Users//////////////
router.get("/users/me", Auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})
/////////////////////Read User//////////////
router.get("/users/:id", async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(400).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()

    }
})
/////////////////////////UPDATE USER //////////////////////
router.patch("/users/me", Auth, async (req, res) => {
    const updates = Object.keys(req.body);
    // let isValidUpdate = false;
    const allowedUpdate = ["name", "age", "email", "password"];

    // for (key in updates) {
    //     const ss=allowedUpdate.includes(key);
    //     if (!ss) {
    //        return isValidUpdate = true;

    //     }

    // }
    const isValidUpdate = updates.every((update) => allowedUpdate.includes(update));
    if (!isValidUpdate) {
        return res.status(404).send("error : This Update Is'nt Includes !");
    }
    try {
        // const user = req.user;
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})
////////////////Delelte User /////////////////////
router.delete("/users/me", Auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id);

        await req.user.remove();
        GoodByeEmail(req.user.email,req.user.name)
        res.send(req.user);
    } catch (e) {
        res.status(404).send();

    }
})

//////////////////avatar Iùmage//////////////
const upload = multer({

    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please Upload JPG OR JPEG OR PNG FORMAT !!"))
        }
        cb(undefined, true)
    }
});

router.post("/users/me/avatar", Auth, upload.single("avatar"), async (req, res) => {
const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).jpeg().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send("Upload Successsssssss! ")
}, (error, req, res, next) => {
    res.status(500).send({ error: error.message });

})

router.delete("/users/me/avatar", Auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send("avattar Deleted!")

})

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set("Content-Type", "image/jpg")
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
})
module.exports = router;