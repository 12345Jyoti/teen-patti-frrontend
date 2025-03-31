// import React, { useState } from 'react';

// const Login = ({ onOtpVerified }) => {
//     const [medium, setMedium] = useState('MOBILE');
//     const [isdCode, setIsdCode] = useState('+91');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [otp, setOtp] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [loading, setLoading] = useState(false);

//     // const API_URL = 'http://localhost:8080/teenPattiGame/api/v1/user/register';

//     const API_URL = 'http://18.213.28.138:8080/teenPattiGame/api/v1/user/register';

//     const validatePhoneNumber = (phoneNumber) => /^[0-9]{10}$/.test(phoneNumber);

//     const requestOtp = async () => {
//         if (!validatePhoneNumber(phoneNumber)) {
//             alert('Invalid phone number. Please enter a valid 10-digit number.');
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await fetch(API_URL, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ medium, isdCode, phoneNumber }),
//             });

//             // if (response.ok) {
//                 alert('OTP sent successfully!');
//                 setOtpSent(true);
//             // } else {
//             //     throw new Error('Failed to request OTP.');
//             // }
//         } catch (error) {
//             alert('Error requesting OTP: ' + error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const verifyOtp = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(API_URL, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ medium, isdCode, phoneNumber, otp }),
//             });

//             // if (response.ok) {
//                 const authorizationHeader = response.headers.get('Authorization');
//                 console.log("authorizationHeader"+authorizationHeader);
//                 if (authorizationHeader) {
//                     const authToken = authorizationHeader.split(' ')[1]; // Extract the token
//                     onOtpVerified(authToken); // Pass token to parent component
//                     alert('OTP Verified successfully!');
//                 } else {
//                     throw new Error('Token not received in the response header');
//                 }
//             // } else {
//             //     throw new Error('Invalid OTP');
//             // }
//         } catch (error) {
//             alert('Error verifying OTP: ' + error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <h1>Teen Patti Game Login</h1>
//             <div>
//                 <label htmlFor="medium">Login Medium:</label>
//                 <select
//                     id="medium"
//                     value={medium}
//                     onChange={(e) => setMedium(e.target.value)}
//                 >
//                     <option value="MOBILE">Mobile</option>
//                     <option value="EMAIL">Email</option>
//                 </select>
//             </div>
//             <div>
//                 <label htmlFor="isdCode">ISD Code:</label>
//                 <input
//                     type="text"
//                     id="isdCode"
//                     value={isdCode}
//                     onChange={(e) => setIsdCode(e.target.value)}
//                     required
//                 />
//             </div>
//             <div>
//                 <label htmlFor="phoneNumber">Phone Number:</label>
//                 <input
//                     type="text"
//                     id="phoneNumber"
//                     value={phoneNumber}
//                     onChange={(e) => setPhoneNumber(e.target.value)}
//                     placeholder="Enter your Phone Number"
//                     required
//                 />
//             </div>
//             <button onClick={requestOtp} disabled={loading}>
//                 {loading ? 'Sending OTP...' : 'Request OTP'}
//             </button>
//             {otpSent && (
//                 <div>
//                     <label htmlFor="otp">OTP:</label>
//                     <input
//                         type="text"
//                         id="otp"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         placeholder="Enter your OTP"
//                         required
//                     />
//                     <button onClick={verifyOtp} disabled={loading}>
//                         {loading ? 'Verifying OTP...' : 'Verify OTP'}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Login;


import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login = ({ onOtpVerified }) => {
    const [medium, setMedium] = useState('MOBILE');
    const [isdCode, setIsdCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://18.213.28.138:8080/teenPattiGame/api/v1/user/register';

    const validatePhoneNumber = (phoneNumber) => /^[0-9]{10}$/.test(phoneNumber);

    const requestOtp = async () => {
        if (!validatePhoneNumber(phoneNumber)) {
            alert('Invalid phone number. Please enter a valid 10-digit number.');
            return;
        }

        setLoading(true);
        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ medium, isdCode, phoneNumber }),
            });

            alert('OTP sent successfully!');
            setOtpSent(true);
        } catch (error) {
            alert('Error requesting OTP: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ medium, isdCode, phoneNumber, otp }),
            });

            const authorizationHeader = response.headers.get('Authorization');
            if (authorizationHeader) {
                const authToken = authorizationHeader.split(' ')[1]; // Extract token
                onOtpVerified(authToken);
                alert('OTP Verified successfully!');
            } else {
                throw new Error('Token not received in the response header');
            }
        } catch (error) {
            alert('Error verifying OTP: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="card shadow-lg p-4">
                <h2 className="text-center mb-3">Teen Patti Game Login</h2>

                <div className="mb-3">
                    <label htmlFor="medium" className="form-label">Login Medium:</label>
                    <select className="form-select" id="medium" value={medium} onChange={(e) => setMedium(e.target.value)}>
                        <option value="MOBILE">Mobile</option>
                        <option value="EMAIL">Email</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="isdCode" className="form-label">ISD Code:</label>
                    <input type="text" className="form-control" id="isdCode" value={isdCode} onChange={(e) => setIsdCode(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">Phone Number:</label>
                    <input type="text" className="form-control" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter your Phone Number" required />
                </div>

                <button className="btn btn-primary w-100 mb-3" onClick={requestOtp} disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Request OTP'}
                </button>

                {otpSent && (
                    <div>
                        <div className="mb-3">
                            <label htmlFor="otp" className="form-label">OTP:</label>
                            <input type="text" className="form-control" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter your OTP" required />
                        </div>
                        <button className="btn btn-success w-100" onClick={verifyOtp} disabled={loading}>
                            {loading ? 'Verifying OTP...' : 'Verify OTP'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
