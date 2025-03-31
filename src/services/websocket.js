import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient = null;

export const connectWebSocket = (token, onMessageReceived) => {
    // const socket = new SockJS('http://localhost:8080/teenPattiGame/join-game'); // Replace with your WebSocket endpoint

    const socket1 = new SockJS('http://18.213.28.138:8080/teenPattiGame/join-game'); // Replace with your WebSocket endpoint


    console.log("Hello, World!");


    stompClient = Stomp.over(socket1);

    // Connect to WebSocket with the token
    stompClient.connect({ Authorization: `Bearer ${token}` }, (frame) => {
        console.log('Connected:', frame);

        // Subscribe to a topic
        stompClient.subscribe('/topic/game-updates', (message) => {
            onMessageReceived(JSON.parse(message.body));
        });
    }, (error) => {
        console.error('WebSocket connection error:', error);
    });
};
// function connectWebSocket() {
//     const socket = new SockJS('http://localhost:8081/teenPattiGame/join-game');
//     const stompClient = Stomp.over(socket);

//     stompClient.connect({}, function () {
//         console.log('Connected');
//         stompClient.subscribe('/topic/game', function (message) {
//             console.log(message.body);
//         });
//     }, function (error) {
//         console.error('Connection error', error);
//         setTimeout(connectWebSocket, 5000); // Retry connection
//     });
// }


export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.disconnect();
        console.log('Disconnected from WebSocket');
    }
};

export const sendMessage = (destination, payload) => {
    if (stompClient && stompClient.connected) {
        stompClient.send(destination, {}, JSON.stringify(payload));
    } else {
        console.error('WebSocket is not connected.');
    }
};
