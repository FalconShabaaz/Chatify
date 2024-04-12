const dotenv = require("dotenv")
dotenv.config()
var express = require('express');
const { chats } = require('../data/data');
var router = express.Router();
const cors = require('cors');
const connectDB = require('../config/db');
const userRoutes = require('./userRoutes');
const chatRoutes = require('./chatRoutes');
const messageRoutes = require('./messageRoutes');
const {notFound,errorHandler} = require('../middlewares/errorMiddleware');
const path = require('path');


// ALL MY MAIN ROUTES HERE
connectDB();
router.use(cors());

router.use(express.json());
router.get('/',function(req,res){
  res.render('index',{title:'Chatify'});
})

router.use('/api/user',userRoutes);
router.use('/api/chat',chatRoutes);
router.get('/api/chat',function(req,res){
  res.send(chats)
});
router.use("/api/message",messageRoutes);

// -----------------------Deployment---------------------------------


const __dirname1 = path.resolve();
if(process.env.VITE_NODE_ENV === 'production'){
    router.use(express.static(path.join(__dirname1,'/build')));
    router.get('*',(req,res)=>{
      res.sendFile()
    })
}
else{
  const server = app.listen(PORT,console.log(`Server running on PORT ${PORT}...`.yellow.bold));
}

// -----------------------Deployment---------------------------------


router.get('/api/chat/:id',function(req,res){
  // console.log(req.params.id)
  const singleChat = chats.find(c=>c._id === req.params.id)
  res.send(singleChat)
})

router.use(notFound);
router.use(errorHandler);

// const server = 5000;
// const io = require('socket.io')(server,{
//   pingTimeout:60000,
//   cors:{
//     origin: 'https//localhost:3000',
//   },
// });

// io.on("connection", (socket)=>{
//     console.log("CONNECTED TO SOCKET.IO");
// })



module.exports = router;
