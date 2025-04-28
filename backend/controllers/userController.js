const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModels");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, dob, designation } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !dob || !designation) {
        res.status(400)
            .json({
                error: "Please fill all the required fields",
                success: false
            })
    }
    if (password.length < 6) {
        res.status(400)
            .json({
                error: "Password must be atleast upto 6 characters.",
                success: false
            })
    }

    // Check if users email already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
            .json({
                error: "Email has already been registered.",
                success: false
            })
    }


    // Create new user
    const user = await User.create({
        name,
        email,
        password,
        phone,
        dob,
        designation,
    })

    // Generate Token
    const token = generateToken(user._id)

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true,
    })

    if (user) {
        res.status(201).json({
            message: "Signup successfull",
            success: true
        })
    } else {
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            })
    }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Validate Request
    if (!email || !password) {
        res.status(400)
            .json({
                error: 'Please fill all the required fields.',
                success: false
            })
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        res.status(400)
            .json({
                error: 'User not found, please signup.',
                success: false
            })
    }

    // User exists, check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    if (user && passwordIsCorrect) {

        // Generate Token
        const token = generateToken(user._id)

        // Send HTTP-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true,
        })
        
        res.status(201).json({
            message: "Login successfull",
            success: true,
            email,
            token,
            name: user.name
        })
    } else {
        res.status(500)
            .json({
                message: "Invalid email or password",
                success: false
            })
    }

});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true,
    });
    return res.status(200)
        .json({
            message: "Logged out successfully",
            success: true
        });
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const { _id, name, email, phone, dob, designation, validFrom, validTo } = user
        res.status(200).json({
            _id,
            name,
            email,
            phone,
            dob,
            designation,
            validFrom,
            validTo,
        })
    } else {
        res.status(400)
        throw new Error("User not found");

    }
})

// Get login status
const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ success: false });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (verified) {
            return res.json({ success: true });
        }
        return res.json({ success: false });
    } catch (error) {
        return res.json({ success: false });
    }
});


// Update user
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        const { email, name, phone, dob, designation, validFrom, validTo } = user;
        user.email = email;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.dob = req.body.dob || dob;
        user.designation = req.body.designation || designation;

        await user.save();
        res.status(200)
            .json({
                message: 'Updated successfully',
                success: true
            })
    } else {
        res.status(404)
            .json({
                error: 'Something went wrong',
                success: false
            })
    }
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const { oldPassword, password } = req.body;

    if (!user) {
        res.status(404)
            .json({
                error: 'User not found, Please signup',
                success: false
            })
    }

    // Validate
    if (!oldPassword || !password) {
        res.status(400)
            .json({
                error: 'Please add old and new password',
                success: false
            })
    }

    // Check if old password matches password in DB
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

    // save new password
    if (!passwordIsCorrect) {
        res.status(400)
            .json({
                error: 'Old password is incorrect',
                success: false
            })
    } else {
        user.password = req.body.password;
        await user.save();
        res.status(200)
            .json({
                message: 'Password changed successfully',
                success: true
            })
    }
});

// Forgot password
const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404)
        throw new Error("User does not exist");
    }

    // Delete token if it exists in db
    let token = await Token.findOne({ userId: user._id })
    if (token) {
        await token.deleteOne();
    }

    // Create reset token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id
    console.log(resetToken);


    // Hash token before saving to DB
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Save token to db
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000) // Thirty minutes
    }).save();

    // Construct Reset url 
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

    // Reset email
    const message = `
        <h2>Hello ${user.name}</h2>
        <p>Please use the url below to reset your password</p>
        <p>This reset link is valid for 30 minutes</p>

        <a href=${resetUrl} clicktracking = off>${resetUrl}</a>
        <p>Regards...</p>
        <p>Management Team</p>
        `;
    const subject = "Password Reset Request"
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {
        await sendEmail(subject, message, send_to, sent_from);
        res.status(200).json({ success: true, message: "Reset Email Sent" });
    } catch (error) {
        res.status(500);
        throw new Error("Email not sent, please try again ");
    }
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {

    const { password } = req.body
    const { resetToken } = req.params

    // hash token, than compare to Token in DB
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Find token in DB 
    const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: { $gt: Date.now() }
    })

    if (!userToken) {
        res.status(500)
        throw new Error("Invalid or expired token");
    }

    // Find user
    const user = await User.findOne({
        _id: userToken.userId,
    });
    user.password = password;
    await user.save();
    res.status(200).json({
        message: "Password Reset Successfull, Please Login"
    });

});


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
}
