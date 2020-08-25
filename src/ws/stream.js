const stream = (socket) =>{
    socket.on('subscribe',(data) => {
        //dolaczanie do pokoju
        socket.join(data.room);
        socket.join(data.socketId);
    } );
};


module.exports=stream;