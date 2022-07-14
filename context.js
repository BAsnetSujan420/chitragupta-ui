import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import axios from 'axios';
import Jsona from 'jsona';
import { useRouter } from 'next/router';
import { handleUnauthorized } from './lib/utils';

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); // this is only to check if user is loading

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [users, setUsers] = useState([]);

  const [token, setToken] = useState('');

  const dataFormatter = new Jsona();

  const fetchUser = useCallback(async () => {
    const userController = new AbortController();
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/user.json`,
        {
          headers: { Authorization: localStorage.token },
          signal: userController.signal,
        },
      );

      setUser(dataFormatter.deserialize(response.data));
      setLoading(false);
      userController = null;
    } catch (error) {
      // console.log(error);
      handleUnauthorized(error, setToken, router);
    }

    return () => userController?.abort();
  });

  const isAdmin = () => user && user.role === 'admin';

  useEffect(() => {
    setToken(localStorage.token);
    if (localStorage.token && localStorage.token !== '') {
      fetchUser();
    } else {
      router.push({
        pathname: '/login',
        query: { returnUrl: window.location.pathname },
      });
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        leaveRequests,
        setLeaveRequests,
        users,
        setUsers,
        loading,
        setLoading,
        isAdmin,
        token,
        setToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => useContext(AppContext);
