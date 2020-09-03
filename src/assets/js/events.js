import helpers from './settings.js';

window.addEventListener('load', () => {
    document.getElementById('local').addEventListener( 'click', () => {
        if ( !document.pictureInPictureElement ) {
            document.getElementById('local').requestPictureInPicture()
                    .catch(error => {
                        // Video failed to enter Picture-in-Picture mode.
                        console.error(error);
                    } );
        }
        else {
            document.exitPictureInPicture()
                    .catch(error => {
                        // Video failed to leave Picture-in-Picture mode.
                        console.error(error);
                    } );
        }
    } );
    
    
     //creating room after clicking a button
    document.getElementById( 'create-room' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();
        let roomName = document.querySelector( '#room-name' ).value;
        if (roomName) {
            //remove error message, if any
            document.querySelector( '#err-msg' ).innerHTML = "";
            let roomLink = `${ location.origin }?room=${ roomName.trim().replace( ' ', '_' ) }_${ helpers.generateRandomString() }`;
            //show message with link to room
            document.querySelector( '#room-created' ).innerHTML = `Pokój utworzony pomyślnie. Kliknij <a href='${ roomLink }'>tutaj</a> aby wejść do pokoju. 
                Po wejściu do pokoju wystarczy, że prześlesz link innym osobom, aby również się połączyły.`;
            document.querySelector( '#room-name' ).value = '';
        }
        else {
            document.querySelector( '#err-msg' ).innerHTML = "Pole z nazwą pokoju nie może być puste";
        }
    } );
    
    
} );
