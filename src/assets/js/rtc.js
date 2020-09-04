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


            socket.on( 'ice candidates', async ( data ) => {
                data.candidate ? await pc[data.sender].addIceCandidate( new RTCIceCandidate( data.candidate ) ) : '';
            } );


            socket.on( 'sdp', async ( data ) => {
                if ( data.description.type === 'offer' ) {
                    data.description ? await pc[data.sender].setRemoteDescription( new RTCSessionDescription( data.description ) ) : '';

                    h.getUserFullMedia().then( async ( stream ) => {
                        if ( !document.getElementById( 'local' ).srcObject ) {
                            h.setLocalStream( stream );
                        }

                        //save my stream
                        myStream = stream;

                        stream.getTracks().forEach( ( track ) => {
                            pc[data.sender].addTrack( track, stream );
                        } );

                        let answer = await pc[data.sender].createAnswer();

                        await pc[data.sender].setLocalDescription( answer );

                        socket.emit( 'sdp', { description: pc[data.sender].localDescription, to: data.sender, sender: socketId } );
                    } ).catch( ( e ) => {
                        console.error( e );
                    } );
                }

                else if ( data.description.type === 'answer' ) {
                    await pc[data.sender].setRemoteDescription( new RTCSessionDescription( data.description ) );
                }
            } );


            socket.on( 'chat', ( data ) => {
                h.addChat( data, 'remote' );
            } );
        } );


        function getAndSetUserStream() {
            h.getUserFullMedia().then( ( stream ) => {
                //save my stream
                myStream = stream;

                h.setLocalStream( stream );
            } ).catch( ( e ) => {
                console.error( `stream error: ${ e }` );
            } );
        }

        function init( createOffer, partnerName ) {
            }



            //create offer
            if ( createOffer ) {
                pc[partnerName].onnegotiationneeded = async () => {
                    let offer = await pc[partnerName].createOffer();

                    await pc[partnerName].setLocalDescription( offer );

                    socket.emit( 'sdp', { description: pc[partnerName].localDescription, to: partnerName, sender: socketId } );
                };
            }



            //send ice candidate to partnerNames
            pc[partnerName].onicecandidate = ( { candidate } ) => {
                socket.emit( 'ice candidates', { candidate: candidate, to: partnerName, sender: socketId } );
            };






        function shareScreen() {
            h.shareScreen().then( ( stream ) => {
                h.toggleShareIcons( true );

                //disable the video toggle btns while sharing screen. This is to ensure clicking on the btn does not interfere with the screen sharing
                h.toggleVideoBtnDisabled( true );

                //save my screen stream
                screen = stream;

                //share the new stream with all partners
                broadcastNewTracks( stream, 'video', false );

                //When the stop sharing button shown by the browser is clicked
                screen.getVideoTracks()[0].addEventListener( 'ended', () => {
                    stopSharingScreen();
                } );
            } ).catch( ( e ) => {
                console.error( e );
            } );
        }



        function stopSharingScreen() {
            //enable video toggle btn
            h.toggleVideoBtnDisabled( false );

            return new Promise( ( res, rej ) => {
                screen.getTracks().length ? screen.getTracks().forEach( track => track.stop() ) : '';

                res();
            } ).then( () => {
                h.toggleShareIcons( false );
                broadcastNewTracks( myStream, 'video' );
            } ).catch( ( e ) => {
                console.error( e );
            } );
        }



        function broadcastNewTracks( stream, type, mirrorMode = true ) {
            h.setLocalStream( stream, mirrorMode );

            let track = type == 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];

            for ( let p in pc ) {
                let pName = pc[p];

                if ( typeof pc[pName] == 'object' ) {
                    h.replaceTrack( track, pc[pName] );
                }
            }
        }
} );
