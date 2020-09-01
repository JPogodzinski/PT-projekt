export default {
    generateRandomString() {
        const crypto = window.crypto || window.msCrypto;
        let array = new Uint32Array(1);

        return crypto.getRandomValues(array);
    },
    getIceServer() {
        return {
            iceServers: [
                {
                    urls: [ "stun:eu-turn6.xirsys.com" ]
                }, {
                    username: "ZSzSvL8QJ_4SZbzvuPQD-jMR-qqK1QTW5Puq7j2LBToDlgHj1AyoZqyrpyqt-2sfAAAAAF9FbVlsb2JieTI1MA==",
                    credential: "5137e7b8-e70d-11ea-9252-0242ac140004",
                    urls: [
                        "turn:eu-turn6.xirsys.com:80?transport=udp",
                        "turn:eu-turn6.xirsys.com:3478?transport=udp",
                        "turn:eu-turn6.xirsys.com:80?transport=tcp",
                        "turn:eu-turn6.xirsys.com:3478?transport=tcp",
                        "turns:eu-turn6.xirsys.com:443?transport=tcp",
                        "turns:eu-turn6.xirsys.com:5349?transport=tcp"
                    ]
                }
            ]
        };
    },

    toggleModal( id, show ) {
        let el = document.getElementById( id );

        if ( show ) {
            el.style.display = 'block';
            el.removeAttribute( 'aria-hidden' );
        }

        else {
            el.style.display = 'none';
            el.setAttribute( 'aria-hidden', true );
        }
    },

    setLocalStream( stream, mirrorMode = true ) {
        const localVidElem = document.getElementById( 'local' );

        localVidElem.srcObject = stream;
        mirrorMode ? localVidElem.classList.add( 'mirror-mode' ) : localVidElem.classList.remove( 'mirror-mode' );
    },

    getQString( url = '', keyToReturn = '' ) {
        url = url ? url : location.href;
        let queryStrings = decodeURIComponent( url ).split( '#', 2 )[0].split( '?', 2 )[1];

        if ( queryStrings ) {
            let splittedQStrings = queryStrings.split( '&' );

            if ( splittedQStrings.length ) {
                let queryStringObj = {};

                splittedQStrings.forEach( function ( keyValuePair ) {
                    let keyValue = keyValuePair.split( '=', 2 );

                    if ( keyValue.length ) {
                        queryStringObj[keyValue[0]] = keyValue[1];
                    }
                } );

                return keyToReturn ? ( queryStringObj[keyToReturn] ? queryStringObj[keyToReturn] : null ) : queryStringObj;
            }

            return null;
        }

        return null;
    },
}
