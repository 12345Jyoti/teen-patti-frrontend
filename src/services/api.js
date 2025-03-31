export const requestOtp = async (medium, isdCode, phoneNumber) => {
    const response = await fetch('api/v1/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medium, isdCode, phoneNumber })
    });
  
    return response.json();
  };
  
  export const verifyOtp = async (medium, isdCode, phoneNumber, otp) => {
    const response = await fetch('api/v1/user/verifyOtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medium, isdCode, phoneNumber, otp })
    });
  
    if (response.ok) {
      const token = response.headers.get('Authorization');
      return token;
    } else {
      throw new Error('Invalid OTP');
    }
  };
  