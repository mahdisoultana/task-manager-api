
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./Task");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email Is Invalide !");
            }
        }
    },
    password: {
        required: true,
        type: String,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Email Is Invalide !");
            }
        }
    },
    age: {
        type: Number,
        default: 0
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})
//////////////////RealtionShip between Task And User ////////////////
userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
});
//////////////////Hide PassWord And Token ////////////////
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

///////////Generate New Token :::////////////////
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ id: user._id.toString() }, process.env.TOKEN);
    user.tokens = user.tokens.concat({ token })
    await user.save();
    return token;
}

///////////bCRYPTE pASSWORD :::////////////////

userSchema.statics.login = async (email, pass) => {

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Unable To Login !")
    }
    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
        throw new Error("Unable To Login !")
    }
    return user;
}

///////////////Hash Password Before save//////////
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()

})
///////////////////////Remove Task Owner BEFORE Remove User /////////
userSchema.pre("remove", async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id })

    next();

})


const User = mongoose.model("User", userSchema);

module.exports = User;