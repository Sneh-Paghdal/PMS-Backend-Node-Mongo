const ParkingModel = require("../models/parkingModel");
const { userModel, adminUserModel } = require("../models/user.model");
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Function to generate random string
function generateUniqueFileName() {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '');
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${timestamp}_${randomString}.jpg`; // You can adjust the file extension as needed
  }

class PaarkingService {

    static async createParking(ownerName, orgName, parkingX, parkingY, slotsDtl, reqImage) {
        try {

            const parkingDtl = await adminUserModel.findOne({ orgName });
            console.log(parkingDtl);
            if (!parkingDtl) {
                console.log("here1");
                return "Organisation not found";
            }
            console.log("here2");
            const ownerId = parkingDtl['_id'];

            const existingParking = await ParkingModel.findOne({ ownerId });

            console.log("here3");
            if (existingParking) {
                console.log("here4");
                return "Parking already exists";
            } else {
                console.log("here5");
                const imageBuffer = await fs.readFile(reqImage.path);
                const imageFileName = generateUniqueFileName(); // Implement your function to generate a unique file name
                const imagePath = path.join(__dirname, '../uploads', imageFileName);
                await fs.writeFile(imagePath, imageBuffer);
                console.log(`${imagePath}`);
                const newParking = new ParkingModel({ pid: uuidv4(), ownerId, ownerName, orgName, parkingX, parkingY, slotsDtl, image: `/uploads/${imageFileName}` });
                return await newParking.save();
            }
        } catch (error) {
            throw error;
        }
    }

    static async getParkingById(pid) {
        try {
            const foundedParking = await ParkingModel.findOne({ pid });
            if (!foundedParking) {
                return "Parking not found";
            } else {
                return foundedParking;
            }
        } catch (e) {
            throw e;
        }
    }

    static async bookSlot(pid, slotId, userDetail) {
        try {
            const temp = await ParkingModel.findOne({ pid, 'slotsDtl.slotId': slotId });
            console.log(temp);
            const result = await ParkingModel.updateOne(
                { pid, 'slotsDtl.slotId': slotId },
                {
                    $set: {
                        'slotsDtl.$.status': true,
                        'slotsDtl.$.detail': userDetail
                    }
                }
            );
            if (result.modifiedCount > 0) {
                console.log(`Slot with slotId ${slotId} and pid ${pid} booked successfully.`);
                return "Slot with slotId ${slotId} and pid ${pid} booked successfully.";
            } else {
                console.log(`No matching document found for slotId ${slotId} and pid ${pid}.`);
                return "No match found while booking";
            }
        } catch (error) {
            throw error;
        }
    }

    static async releaseSlot(pid, slotId) {
        try {
            const result = await ParkingModel.updateOne(
                { pid, 'slotsDtl.slotId': slotId },
                {
                    $set: {
                        'slotsDtl.$.status': false,
                        'slotsDtl.$.detail': {} // Assuming you want to set an empty object
                    }
                }
            );
            if (result.modifiedCount > 0) {
                console.log(`Slot with slotId ${slotId} and pid ${pid} released successfully.`);
                return "Slot with slotId and pid released successfully.";
            } else {
                console.log(`No matching document found for slotId ${slotId} and pid ${pid}.`);
                return "No match found while release";
            }
        } catch (error) {
            throw error;
        }
    }

    static async getListOfParkings() {
        try {

            const parkingList = await ParkingModel.find({}, { pid: 1, orgName: 1, slotsDtl: 1, _id: 0 , image : 1});

            const result = parkingList.map(parking => {
                const totalParkings = parking.slotsDtl.filter(slot => !slot.isObstacle).length;
                const availableParkings = parking.slotsDtl.filter(slot => !slot.isObstacle).filter(slot => !slot.status).length;

                return {
                    pid: parking.pid,
                    orgName: parking.orgName,
                    totalparkings: totalParkings,
                    availableparkings: availableParkings,
                    image: parking.image
                };
            });

            return result;


        } catch (error) {
            throw error;
        }
    }

}

module.exports = PaarkingService;