import wrap from "../utils/wrap.js";
import User from "../models/userModel.js";

/**
 * @desc Auth user & get token
 * @router POST /api/users/login
 * @access Public
 */
export const loginUser = wrap(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Invalid email or password Validation");
    }

    const user = await User.findOne({ email });
    const isPasswordMatch = await user.matchPassword(password);

    if (user && isPasswordMatch) {
        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: await user.getToken(),
        });
    }

    res.status(400);
    throw new Error("Invalid email or password");
});

/**
 * @desc Auth user & get token
 * @router GET /api/users/profile
 * @access Private
 */
export const getLoggedInUser = wrap(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    });
});

/**
 * @desc Create new user
 * @router POST /api/users
 * @access Public
 */
export const createUser = wrap(async (req, res, next) => {
    try {
        let { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            res.status(400);
            console.error("User already exits");
            throw new Error("User already exits");
        }
        user = new User({ name, email, password });

        await user.save();
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: await user.getToken(),
        });
    } catch (e) {
        console.error(e);
        if (res.statusCode === 400) throw e;
        res.status(500);
        throw new Error(e.message);
    }
});

const setProperty = (user, body, property) => body[property] || user[property];

/**
 * @desc Update logged in user profile
 * @router PUT /api/users/profile
 * @access Private
 */
export const updateLoggedInUser = wrap(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.name = setProperty(user, req.body, "name");
    user.email = setProperty(user, req.body, "email");
    if (req.body.password) {
        user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: await updatedUser.getToken(),
    });
});

/**
 * @desc Get all users
 * @router GET /api/users
 * @access Private/Admin
 */
export const getUsers = wrap(async (req, res, next) => {
    const users = await User.find();
    return res.json(users);
});

/**
 * @desc Delete user by id
 * @router DELETE /api/users/:id
 * @access Private/Admin
 */
export const deleteUser = wrap(async (req, res, next) => {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    await User.deleteOne({ _id: userId });
    return res.json({ message: `${userId} user deleted successfully` });
});

/**
 * @desc Get user by ID
 * @router GET /api/users/:id
 * @access Private/Admin
 */
export const getUser = wrap(async (req, res, next) => {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    return res.json(user);
});

/**
 * @desc Update user by ID
 * @router PUT /api/users/:id
 * @access Private/Admin
 */
export const updateUser = wrap(async (req, res, next) => {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.name = setProperty(user, req.body, "name");
    user.email = setProperty(user, req.body, "email");
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();
    return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
    });
});
