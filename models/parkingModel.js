const mongoose = require('mongoose');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid'); 

const {Schema} = mongoose;

const slotDetailSchema = new Schema({
    bookerId: { type: String, required: false },
    bookingTime: { type: String, required: false },
    timeInterval: { type: String, required: false },
    expectedRelease: { type: String, required: false },
    carNumber: { type: String, required: false },
  });
  
  const slotSchema = new Schema({
    slotId: { type: String, required: false },
    slotName: { type: String, required: true },
    isObstacle: { type: Boolean, required: true },
    status: { type: Boolean, required: true },
    detail: { type: slotDetailSchema, required: false },
  });
  
  const parkingSchema = new Schema({
    pid: { type: String, default: uuidv4, required: true },
    orgName: { type: String, required: true },
    ownerId: { type: String, required: true },
    ownerName: { type: String, required: true },
    parkingX: { type: String, required: true },
    parkingY: { type: String, required: true },
    slotsDtl: { type: [slotSchema], required: true },
    image: { type: String, required: false }
  },{ versionKey: false });

  parkingSchema.pre('save',async function () {
    try {
      const parking = this;
    // Generate pid only if it doesn't exist
    if (!parking.pid) {
        parking.pid = uuidv4();
    }

    // Generate slotId for each slot in slotsDtl if not provided
    parking.slotsDtl.forEach(slot => {
        if (!slot.slotId) {
            slot.slotId = uuidv4();
        }
    });
    } catch (error) {
      throw error;
    }
});
  
  const ParkingModel = db.model('parking', parkingSchema);
  module.exports = ParkingModel;