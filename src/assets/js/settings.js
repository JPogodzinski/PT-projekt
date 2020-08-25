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
                    urls: ["stun:eu-turn5.xirsys.com"]
                },
                {
                    username: "d2Zpk9vbXIgQm8eew5QUkBcVdsdG36SZe61s6X_pQwaHJZE17ISi3nJuIM_Myp0kAAAAAF9FW7Fsb2JieTI1MA==",
                    credential: "4fa399eda-e701-11ea-be26-0242ac150003",
                    urls: [
                        "turn:eu-turn5.xirsys.com:80?transport=udp",
                        "turn:eu-turn5.xirsys.com:3478?transport=tcp"
                    ]
                }
            ]
        };
    }
}
