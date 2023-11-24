const parkingService = require("../services/parkingService");

    exports.create = async (req, res, next) => {
        try {
            const reqUploadedImage = req.file;
            const ownerName = req.body.ownerName;
            const orgName = req.body.orgName;
            const parkingX = req.body.parkingX;
            const parkingY = req.body.parkingY;
            const slotsDtl = JSON.parse(req.body.slotsDtl);

            // Call the createParking function from the service
            const createdParking = await parkingService.createParking( ownerName, orgName, parkingX, parkingY, slotsDtl, reqUploadedImage);

            // Respond with success message 
            if(createdParking == "Parking already exists" || createdParking == "Organisation not found"){
                res.status(403).json({message : createdParking});
            }else{
                res.status(200).json({ message: 'Parking created successfully'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    exports.getParkingById = async (req,res,next) => {
        try{
            console.log(req.params.parkingId);
            const pid = req.params.parkingId;
            console.log(pid);
            const parking = await parkingService.getParkingById( pid );
            if(parking == "Parking not found"){
                res.status(404).json({message : parking});
            }else{
                res.status(200).json(parking);
            }
        }catch (e){
            throw e;
        }
    }

    exports.releaseSlot = async (req,res,next) => {
        try{
            const {pid, slotId} = req.body;
            const releaseSlot = await parkingService.releaseSlot(pid,slotId);
            if(releaseSlot == "No match found"){
                res.status(404).json({message : releaseSlot});
            }else{
                res.status(200).json({message : releaseSlot});
            }
        }catch (e){
            throw e;
        }
    }

    exports.bookSlots = async (req,res,next) => {
        try {
            const {pid, slotId, detail} = req.body;
            const bookSlot = await parkingService.bookSlot(pid,slotId,detail);
            if(bookSlot == "No match found"){
                res.status(404).json({message : bookSlot});
            }else{
                res.status(200).json({message : bookSlot});
            }
        } catch (error) {
            throw error;
        }
    }

    exports.getListOfParkings = async (req, res, next) => {
        try {
            const parkingList = await parkingService.getListOfParkings();
            res.status(200).json(parkingList);
        } catch (error) {
            throw error;
        }
    }