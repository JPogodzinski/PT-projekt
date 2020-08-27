const stream = (socket) =>{
    socket.on('subscribe',(data) => {
        //entering the room
        socket.join(data.room);
        socket.join(data.socketId);

        if ( socket.adapter.rooms[data.room].length > 1 ) {
            socket.to( data.room ).emit( 'new user', { socketId: data.socketId } );
        }
    } );
};


module.exports=stream;