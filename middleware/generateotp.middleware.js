const genneraeOTP = (length) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
      const number = Math.floor(Math.random() * 10);
      otp += number;
    }
    return otp
  };

  export { genneraeOTP }