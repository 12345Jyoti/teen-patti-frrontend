import React, { useState } from 'react';
import Login from './components/Login';
import GameArea from './components/GameArea';

const App = () => {
    const [token, setToken] = useState('');

    const handleOtpVerified = (receivedToken) => {
        console.log('Token received in App.js:', receivedToken); // Debugging to confirm token receipt
        setToken(receivedToken); // Set the token in state
    };

    return (
        <div>
            {token ? (
                <GameArea token={token} /> // Render GameArea with the token
            ) : (
                <Login onOtpVerified={handleOtpVerified} /> // Render Login if no token
            )}
        </div>
    );
};

export default App;


// // export default App;
// import React, { useState, useEffect } from 'react';
// import GameArea from './components/GameArea';

// const App = () => {
//     // Hardcoded token to simulate login
//     const hardcodedToken = 'eyJhbGciOiJIUzI1NiJ9.eyJwbGF5ZXJJZCI6NTMsInN1YiI6InVzZXJfNGJiMTg4YzciLCJpYXQiOjE3MzUzMjg5NzQsImV4cCI6MTczNTM2NDk3NH0.qCfzl1i7CgdqwbCWCCZBiSR1y16okpA-4us2StT8LLw';

//     const [token, setToken] = useState(hardcodedToken); // Directly set the token here

//     // If the token exists, show GameArea
//     return (
//         <div>
//             {token ? (
//                 <GameArea token={token} /> // Pass the hardcoded token to the GameArea component
//             ) : (
//                 <p>Loading...</p> // Just in case token is missing, show loading message
//             )}
//         </div>
//     );
// };

// export default App;
