
const User = require('../models/user');
const Application = require('../models/apply'); // Ensure you import the Application model

// Route for users to apply to be writers
export const apply = async (req, res) => {
    try {
        const {
            FirstName,
            LastName,
            Gender,
            VehicleManufacturerAndModel,
            VehicleYear,
            VehiclePlateNumber,
            VehicleColor,
            userId // Ensure the userId is passed in the request body
        } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        if (user) {
            // Create new application
            const newApplication = new Application({
                FirstName,
                LastName,
                Gender,
                VehicleManufacturerAndModel,
                VehicleYear,
                VehiclePlateNumber,
                VehicleColor,
                user: user._id // Ensure the application is linked to the user
            });

            await newApplication.save();

            res.status(200).json({ message: 'Application submitted successfully.' });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
