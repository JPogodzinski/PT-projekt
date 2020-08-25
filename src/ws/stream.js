const stream = (socket) =>{
    socket.on('subscribe',(data) => {
        //entering the room
        socket.join(data.room);
        socket.join(data.socketId);
    } );
};


module.exports=stream;