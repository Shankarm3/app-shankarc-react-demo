import { sessionService } from 'redux-react-session';
import * as sessionApi from '../api/sessionApi';

export const login = (user, history) => {
  return () => {
    return sessionApi.login(user).then(response => {
		console.log(response);
      const { token } = response;
      sessionService.saveSession({ token })
      .then(() => {
        sessionService.saveUser(response.data)
        .then(() => {
          history.push('/');
        }).catch(err => console.error(err));
      }).catch(err => console.error(err));
    });
  };
};

export const logout = (history) => {
	console.log('logout');
  return () => {
    return sessionApi.logout().then(() => {
      sessionService.deleteSession();
      sessionService.deleteUser();
      history.push('/login');
    }).catch(err => {
      throw (err);
    });
  };
};
