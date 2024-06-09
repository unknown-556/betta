import mongoose from "mongoose";
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    FirstName: {
        type: String,
      },
    LastName: {
        type: String,
      },
    Gender: {
        type: String,
      },
    VehicleManufacturerAndModel: {
        type: String,
      },
    VehicleYear: {
        type: String,
      },
    VehiclePlateNumber: {
        type: String,
      },
    VehicleColor: {
        type: String
    },
    role: {
        type: String,
        default: 'writer' },
});

const Apply = mongoose.model("Apply", dataSchema);

export default Apply
