import {useState, useCallback, useEffect} from 'react';

const STORAGE_NAME = 'userData';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [ready, setReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [admin, setAdmin] = useState(false);
    
    const login = useCallback((jwtToken, id, admin) => {
        setToken(jwtToken);
        setUserId(id);
        setAdmin(admin);

        localStorage.setItem(STORAGE_NAME, JSON.stringify({ userId: id, token: jwtToken, admin }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setAdmin(false);
        localStorage.removeItem(STORAGE_NAME);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(STORAGE_NAME));

        if (data && data.token) {
            login(data.token, data.userId, data.admin);
        } 
        setReady(true);
    }, [login]);

    return { login, logout, token, userId, ready, admin };
}