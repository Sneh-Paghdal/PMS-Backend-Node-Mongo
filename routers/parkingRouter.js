const router = require('express').Router();
const multer = require('multer');
const ParkingController = require('../controller/parkingController');
const { authenticateToken } = require('../authMiddleware');
const upload = multer({ dest: '../uploads/' }); 
// router.post('/api/register/parking',ParkingController.create); //authenticateToken,
router.post('/api/register/parking', upload.single('image'),ParkingController.create); //authenticateToken,
router.get('/api/get/parking/byid/:parkingId',authenticateToken,ParkingController.getParkingById);
router.post('/api/release/slot',authenticateToken,ParkingController.releaseSlot);
router.post('/api/book/slot/withuser',authenticateToken,ParkingController.bookSlots);
router.get('/api/getall/parkings',authenticateToken,ParkingController.getListOfParkings);
module.exports = router;