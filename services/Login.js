import React, { useEffect } from 'react'

function Login() {
    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        
        const urlencoded = new URLSearchParams();
        urlencoded.append("username", "admin");
        urlencoded.append("password", "S0lut!0n");
        urlencoded.append("grant_type", "password");
        urlencoded.append("client_id", "react");
        urlencoded.append("client_secret", "mBbGvNKzOpPn13BuqKxcZicv8nu4eKq5");
        
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
          redirect: "follow"
        };
        
        fetch("https://idp.authweiler.com/realms/master/protocol/openid-connect/token", requestOptions)
          .then((response) => response.json())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
   
    }, [])
    
  return null
}

export default Login