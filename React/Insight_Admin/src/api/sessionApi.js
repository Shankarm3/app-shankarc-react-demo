// Simulates server calls

export const login = (user) => {

  let asyncFetch = fetch('/login.json')
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        const error = new Error(response.statusText);
        error.response = response;
        console.log(error);
        throw error;
      }
    })
    .catch(error => { console.log('request failed', error); });
	
	return asyncFetch;
	
/*

  fetch('/login.json', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": user.email,
        "password": user.password
      }),
    })
    .then(response => {
        console.log(response);
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        const error = new Error(response.statusText);
        error.response = response;
        console.log(error);
        throw error;
      }
    })
    .catch(error => { console.log('request failed', error); });

*/	
	
/*  const response = {
    token: '1a2b3c4d',
    data: {
      email: user.email,
      firstName: 'test',
      lastName: 'test'
    }
  };
  return new Promise(resolve => setTimeout(resolve(response), 1000));
  */
};

export const logout = () => {
  return new Promise(resolve => setTimeout(resolve, 1000));
};
