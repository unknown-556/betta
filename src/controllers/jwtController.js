import crypto from 'crypto';
import User from '../models/userModel.js';
import { generateToken } from '../utils/jwt.js';

const hashValue = (value) => {
    const hash = crypto.createHash('sha256');
    hash.update(value);
    return hash.digest('hex');
};

const comparePasswords = (inputPassword, hashedPassword) => {
    return hashValue(inputPassword) === hashedPassword;
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = comparePasswords(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user);

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
