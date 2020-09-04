
import h from './settings.js';

window.addEventListener( 'load', () => {
    const room = h.getQString( location.href, 'room' );
    if ( !room ) {
        document.querySelector( '#room-create' ).attributes.removeNamedItem( 'hidden' );
    }
    else {
        let commElem = document.getElementsByClassName( 'room-comm' );

        for ( let i = 0; i < commElem.length; i++ ) {
            commElem[i].attributes.removeNamedItem( 'hidden' );
        }

        var pc = [];

        let socket = io( '/stream' );

        var socketId = '';
        var myStream = '';
        var screen = '';
        //Get user video by default
        getAndSetUserStream();


        socket.on( 'connect', () => {
            //set socketId
            socketId = socket.io.engine.id;


            socket.emit( 'subscribe', {
                room: room,
                socketId: socketId
            } );


            socket.on( 'new user', ( data ) => {
                socket.emit( 'newUserStart', { to: data.socketId, sender: socketId } );
                pc.push( data.socketId );
                init( true, data.socketId );
            } );


            socket.on( 'newUserStart', ( data ) => {
                pc.push( data.sender );
                init( false, data.sender );
            } );




            socket.on( 'chat', ( data ) => {
                h.addChat( data, 'remote' );
            } );
        } );
