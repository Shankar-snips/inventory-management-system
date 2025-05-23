const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please an email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be up to 6 characters"],
        // maxLength: [23, "Password must not be more than 23 characters"],
    },
    dob: {
        type: Date,
        required: [true, "please add your date of birth"]
    },
    designation: {
        type: String,
        required: [true, "please add your designation"]
    },
    validFrom: {
        type: Date,
        required: [true, "please add valid from date"],
        default: Date.now()
    },
    validTo: {
        type: Date,
        required: [true, "please add valid to date"],
        default: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
    phone: {
        type: String,
        required: [true, "please add phone number"],
        default: "+91",
    },
},
    {
        timestamps: true,
    }
);

// Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;