// export default GameArea;
import React, { useState, useEffect } from 'react';
import { Client as StompClient } from '@stomp/stompjs';

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = JSON.parse(atob(base64));
        console.log("Decoded Token:", jsonPayload);
        return jsonPayload?.playerId || null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

console.log("Hello, World!");


const GameArea = ({ token }) => {
    const [gameId, setGameId] = useState(50);
    const [playerId, setPlayerId] = useState('');
    const [gameStatus, setGameStatus] = useState('BLIND');
    
    const [betAmount, setBetAmount] = useState(100);
    const [stompClient, setStompClient] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('');

    useEffect(() => {
        if (token) {
            const extractedPlayerId = decodeToken(token);
            console.log("Extracted Player ID:", extractedPlayerId);
            if (extractedPlayerId) {
                setPlayerId(extractedPlayerId);
            } else {
                setConnectionStatus('Invalid token');
                return;
            }
        }
    }, [token]);

    const connectWebSocket = () => {
        if (!token || !gameId || !playerId) {
            console.error("Token, Game ID, and Player ID are required to connect");
            setConnectionStatus('Missing required fields');
            return;
        }

        // const socketUrl = `ws://18.213.28.138:8080/teenPattiGame/join-game?token=${token}&gameId=${gameId}`;

        const socketUrl = `ws://localhost:8080/teenPattiGame/join-game?token=${token}&gameId=${gameId}`;

        const socket = new WebSocket(socketUrl);

        const client = new StompClient({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket Connected');
                setConnectionStatus('Connected');
                subscribeToGameUpdates(client);
                setStompClient(client);
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame.headers['message']);
                setConnectionStatus('Connection Error');
            },
            onDisconnect: () => {
                console.warn('STOMP client disconnected');
                setConnectionStatus('Disconnected. Attempting reconnect...');
            },
        });

        client.activate();
        setConnectionStatus('Connecting...');
    };

    let currentGameId = null;

    const subscribeToGameUpdates = (client) => {
        try {
            if (currentGameId && currentGameId !== gameId) {
                console.log(`🚨 Unsubscribing from old game ID: ${currentGameId}`);
                client.unsubscribe(`/topic/gameUpdates/${currentGameId}`);
                client.unsubscribe(`/topic/gameUpdates/${currentGameId}/player/${playerId}`);
            }

            console.log(`✅ Subscribing to new game ID: ${gameId}`);
            client.subscribe(`/topic/gameUpdates/${gameId}`, (event) => {
                const message = JSON.parse(event.body);
                console.log('📩 Game Update Received:', message);
                setGameStatus(message.newStatus || gameStatus);
            });

            client.subscribe(`/topic/gameUpdates/${gameId}/player/${playerId}`, (event) => {
                const message = JSON.parse(event.body);
                console.log('🎯 Private Update for Player:', message);
                alert(`🔔 Private Event: ${message.eventType}`);
            });

               // Subscribe to player-specific error messages
        client.subscribe(`/queue/playerErrors/${playerId}`, (event) => {
            const errorMessage = JSON.parse(event.body);
            console.error('❌ Error Received:', errorMessage);
            alert(`⚠️ Error: ${errorMessage.message}`);
        });


            currentGameId = gameId;
        } catch (error) {
            console.error('❌ Error subscribing to game updates:', error);
        }
    };

    const sendAction = (action) => {
        if (stompClient && stompClient.connected) {
            const message = { playerId, gameId, action, betAmount };
            stompClient.publish({
                destination: '/app/gameAction',
                body: JSON.stringify(message),
            });
            console.log(`Action sent: ${action}`);
        } else {
            console.error('STOMP client is not connected');
            setConnectionStatus('Disconnected. Trying to reconnect...');
            connectWebSocket();
        }
    };

    const disconnectPlayer = () => {
        if (stompClient) {
            stompClient.deactivate();
            setConnectionStatus('Disconnected');
            setStompClient(null);
            console.log('Player disconnected from WebSocket');
        }
    };

    return (
        <div>
            <h2>Game Area</h2>
            <p style={{ color: connectionStatus === 'Connected' ? 'green' : 'red' }}>
                Connection Status: {connectionStatus}
            </p>
            <div>
                <label htmlFor="playerId">Player ID:</label>
                <input type="number" id="playerId" value={playerId} disabled />
            </div>
            <div>
                <label htmlFor="gameId">Game ID:</label>
                <input type="number" id="gameId" value={gameId} onChange={(e) => setGameId(e.target.value)} required />
            </div>
            <div>
                <label>Current Status: {gameStatus}</label>
            </div>
            <div>
                <button onClick={connectWebSocket} style={{ backgroundColor: 'blue', color: 'white' }}>Connect</button>
                <button onClick={() => sendAction('JOIN')}>Join Game</button>
                <button onClick={() => sendAction('BET')}>Place Bet</button>
                <button onClick={() => sendAction('DEAL')}>Deal Cards</button>
                <button onClick={() => sendAction('FOLD')}>Fold</button>
                <button onClick={() => sendAction('SHOW')}>Show Cards</button>
                <button onClick={() => sendAction('SEEN')}>Seen</button>
                <button onClick={() => sendAction('LEAVE')}>Leave Game</button>
                <button onClick={disconnectPlayer} style={{ backgroundColor: 'red', color: 'white' }}>Disconnect</button>
            </div>
        </div>
    );
};

export default GameArea;


// import React, { useState, useEffect } from 'react';
// import { Client as StompClient } from '@stomp/stompjs';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './GameArea.css';

// const decodeToken = (token) => {
//     try {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = JSON.parse(atob(base64));
//         console.log("Decoded Token:", jsonPayload);
//         return jsonPayload?.playerId || null;
//     } catch (error) {
//         console.error('Error decoding token:', error);
//         return null;
//     }
// };

// const GameArea = ({ token }) => {
//     const [gameId, setGameId] = useState(39);
//     const [playerId, setPlayerId] = useState('');
//     const [gameStatus, setGameStatus] = useState('BLIND');
//     const [betAmount, setBetAmount] = useState(100);
//     const [stompClient, setStompClient] = useState(null);
//     const [connectionStatus, setConnectionStatus] = useState('');

//     useEffect(() => {
//         if (token) {
//             const extractedPlayerId = decodeToken(token);
//             if (extractedPlayerId) {
//                 setPlayerId(extractedPlayerId);
//             } else {
//                 setConnectionStatus('Invalid token');
//                 return;
//             }
//         }
//     }, [token]);

//     const connectWebSocket = () => {
//         if (!token || !gameId || !playerId) {
//             setConnectionStatus('Missing required fields');
//             return;
//         }

//         const socketUrl = `ws://localhost:8080/teenPattiGame/join-game?token=${token}&gameId=${gameId}`;
//         const socket = new WebSocket(socketUrl);

//         const client = new StompClient({
//             webSocketFactory: () => socket,
//             debug: (str) => console.log(str),
//             reconnectDelay: 5000,
//             onConnect: () => {
//                 setConnectionStatus('Connected');
//                 subscribeToGameUpdates(client);
//                 setStompClient(client);
//             },
//             onStompError: (frame) => {
//                 setConnectionStatus('Connection Error');
//             },
//             onDisconnect: () => {
//                 setConnectionStatus('Disconnected. Attempting reconnect...');
//             },
//         });

//         client.activate();
//         setConnectionStatus('Connecting...');
//     };

//     const subscribeToGameUpdates = (client) => {
//         client.subscribe(`/topic/gameUpdates/${gameId}`, (event) => {
//             const message = JSON.parse(event.body);
//             setGameStatus(message.newStatus || gameStatus);
//         });

//         client.subscribe(`/topic/gameUpdates/${gameId}/player/${playerId}`, (event) => {
//             const message = JSON.parse(event.body);
//             alert(`🔔 Private Event: ${message.eventType}`);
//         });
//     };

//     const sendAction = (action) => {
//         if (stompClient && stompClient.connected) {
//             const message = { playerId, gameId, action, betAmount };
//             stompClient.publish({
//                 destination: '/app/gameAction',
//                 body: JSON.stringify(message),
//             });
//         } else {
//             setConnectionStatus('Disconnected. Trying to reconnect...');
//             connectWebSocket();
//         }
//     };

//     const disconnectPlayer = () => {
//         if (stompClient) {
//             stompClient.deactivate();
//             setConnectionStatus('Disconnected');
//             setStompClient(null);
//         }
//     };

//     return (
//         <div className="container game-container">
//             <h2 className="text-center">Teen Patti Game</h2>
//             <p className={`status ${connectionStatus === 'Connected' ? 'text-success' : 'text-danger'}`}>
//                 Connection Status: {connectionStatus}
//             </p>

//             <div className="form-group">
//                 <label>Player ID:</label>
//                 <input type="number" className="form-control" value={playerId} disabled />
//             </div>

//             <div className="form-group">
//                 <label>Game ID:</label>
//                 <input type="number" className="form-control" value={gameId} onChange={(e) => setGameId(e.target.value)} required />
//             </div>

//             <div className="game-actions">
//                 <button className="btn btn-primary" onClick={connectWebSocket}>Connect</button>
//                 <button className="btn btn-success" onClick={() => sendAction('JOIN')}>Join Game</button>
//                 <button className="btn btn-warning" onClick={() => sendAction('BET')}>Place Bet</button>
//                 <button className="btn btn-info" onClick={() => sendAction('DEAL')}>Deal Cards</button>
//                 <button className="btn btn-danger" onClick={() => sendAction('FOLD')}>Fold</button>
//                 <button className="btn btn-secondary" onClick={() => sendAction('SHOW')}>Show Cards</button>
//                 <button className="btn btn-dark" onClick={() => sendAction('SEEN')}>Seen</button>
//                 <button className="btn btn-outline-primary" onClick={() => sendAction('LEAVE')}>Leave Game</button>
//                 <button className="btn btn-outline-danger" onClick={disconnectPlayer}>Disconnect</button>
//             </div>
//         </div>
//     );
// };

// export default GameArea;
