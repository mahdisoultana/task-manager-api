const express = require("express");
const router = new express.Router();
const Task = require("../models/Task");
const Auth = require("../middleware/Auth");
const User = require("../models/User");

//////////////////ADD TASK/////////
router.post("/tasks", Auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task)
    } catch (e) {
        res.status(404).send(e)
    }
});
//////////////////Read TASKS/////////
router.get("/tasks", Auth, async (req, res) => {
 
    const match = {};
    const sort = {};
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
            sort[parts[0]] = parts[1] === "desc"   ? -1 : 1;
    }
    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }
    try {
        // const tasks = await Task.find({owner:req.user._id});
        const user = await User.findById(req.user._id);
        await user.populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();

        res.send(user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }
})
//////////////////ReadTASK/////////
router.get("/task/:id", Auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        res.send(task);
    } catch (e) {
        res.status(500).send()
    }
})
/////////////////////////UPDATE TASK //////////////////////
router.patch("/tasks/:id", Auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdate = ["description", "completed"];
    const isValidUpdate = updates.every((update) => allowedUpdate.includes(update));
    if (!isValidUpdate) {
        return res.status(404).send("error : This Update Is'nt Includes !");
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        updates.forEach((key) => task[key] = req.body[key]);
        await task.save();
        // const taskUp = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(400).send()
        }

        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})
///////////////////////DELETE TASK :///////////////
router.delete("/tasks/:id", Auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(404).send(e);
    }
})

module.exports = router;