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
    
} );
