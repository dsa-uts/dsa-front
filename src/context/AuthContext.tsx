// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {logout as logoutApi} from '../api/services/PostAPI';

interface AuthContextType {
    token: string | null;
    user_id: number | null;
    is_admin: boolean;
    setToken: (token: string | null) => void;
    setUserId: (user_id: number | null) => void;
    setIsAdmin: (is_admin: boolean) => void;
    resetTimer: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user_id, setUserId] = useState<number | null>(localStorage.getItem('user_id') ? parseInt(localStorage.getItem('user_id') as string) : null);
    const [is_admin, setIsAdmin] = useState<boolean>(localStorage.getItem('is_admin') === 'true');

    const saveToken = (newToken: string | null) => {
        setToken(newToken);
        if (newToken === null) {
            localStorage.removeItem('token');
        } else {
            localStorage.setItem('token', newToken);
        }
    };

    useEffect(() => {
        const handleTokenUpdate = (event: CustomEvent) => {
            saveToken(event.detail.newToken);
        };
    
        window.addEventListener('token-update', handleTokenUpdate as EventListener);
    
        return () => {
            window.removeEventListener('token-update', handleTokenUpdate as EventListener);
        };
    }, [token]);

    const saveUserId = (newUserId: number | null) => {
        setUserId(newUserId);
        if (newUserId === null || newUserId < 0) {
            localStorage.removeItem('user_id');
        } else {
            localStorage.setItem('user_id', newUserId.toString());
        }
    };

    const saveIsAdmin = (newIsAdmin: boolean) => {
        setIsAdmin(newIsAdmin);
        localStorage.setItem('is_admin', newIsAdmin ? 'true' : 'false');
    }   

    let logoutTimer: ReturnType<typeof setTimeout>;

    const logout = () => {
        if (!token) {
            return;
        }
        console.log('Logging out...');
        navigate('/');
        logoutApi(token as string);
        saveToken(null);
        saveUserId(null);
        saveIsAdmin(false);
        alert('ログアウトしました。');
    };

    useEffect(() => {
        const handleLogout = (event: CustomEvent) => {
            logout();
        };

        window.addEventListener('logout', handleLogout as EventListener);

        return () => {
            window.removeEventListener('logout', handleLogout as EventListener);
        };
    }, []);

    const resetTimer = () => {
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(() => {
        logout();
        }, 1000*60*30); // 30 minutes
    };

    useEffect(() => {
        if (token) {
            resetTimer();
        }
        return () => {
            clearTimeout(logoutTimer);
        };
    }, [token, resetTimer]);

    return (
        <AuthContext.Provider value={{ token, user_id, is_admin, setToken: saveToken, setUserId: saveUserId, setIsAdmin: saveIsAdmin, resetTimer, logout }}>
        {children}
        </AuthContext.Provider>
    );
};
