import User from '../models/userModel.js';
import cryptoHash from 'crypto';
import { signUpValidator, signInValidator } from '../validators/authValidators.js';
import { formatZodError } from '../../errorMessage.js';
import main from '../../server.js'; 
import { generateToken } from '../utils/jwt.js';

const hashValue = (value) => {
    const hash = cryptoHash.createHash('sha256');
    hash.update(value);
    return hash.digest('hex');
};

const comparePasswords = (inputPassword, hashedPassword) => {
    return hashValue(inputPassword) === hashedPassword;
};

export const signUp = async (req, res) => {
    const registerResults = signUpValidator.safeParse(req.body);
    if (!registerResults.success) {
        return res.status(400).json(formatZodError(registerResults.error.issues));
    }
    try {
        const { email } = req.body;
        const user = await User.findOne({
            $or: [{ email: email }]
        });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        } else {
            const { name, email, password } = req.body;
            const encryption = hashValue(password);
            const newUser = new User({
                name,
                email,
                password: encryption,
            });
            await newUser.save();

            
            main.io.emit('user-signup', { userId: newUser._id, name: newUser.name, email: newUser.email });

            console.log('User registered successfully', newUser);
            return res.redirect('/login.html');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('INTERNAL SERVER ERROR', error.message);
    }
};

export const signIn = async (req, res, next) => {
    const loginResults = signInValidator.safeParse(req.body);
    if (!loginResults.success) {
        return res.status(400).json(formatZodError(loginResults.error.issues));
    } 
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User with email not found' });
        }
        
        // Compare password here if needed
        // const comparePass = comparePasswords(password, user.password);
        // if (!comparePass) {
        //     return res.status(400).json({ message: 'Password is incorrect' });
        // }
        
        
        const accessToken = generateToken(user._id, user.name);
        

        user.token = accessToken;
        await user.save();
        main.io.emit('user-login', { userId: user._id, name: user.name, email: user.email });

        // Send response with token
        console.log('Login sa successful', user, accessToken);
        return res.json({ accessToken });
        

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('INTERNAL SERVER ERROR', error.message);
    }
};


export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId, 'name email');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Log the user ID and user data
        console.log(`User ID: ${userId}, User Data: ${JSON.stringify(user)}`);
        return res.json({ user })

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error('Internal server error:', error);
    }
};




// export const logout = async (req, res, next) => {
//     // Implement logout logic here if needed
// };

export default { signUp, signIn, getUserProfile };
