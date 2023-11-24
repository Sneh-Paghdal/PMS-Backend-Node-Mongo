require('dotenv').config();
const app = require('./app');
const db = require('./config/db');
const UserModel = require('./models/user.model');
const port = process.env.PORT || 3000;
const authMiddleware = require('./authMiddleware')

app.get('/',(req,res)=>{
    res.send("Sneh Paghdal");
});

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port} port`);
});
