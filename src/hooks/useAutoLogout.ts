// src/hooks/useAutoLogout.ts
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const useAutoLogout = () => {
    const { resetTimer } = useAuth();

    useEffect(() => {
        const events = ['click', 'load', 'keydown'];
        events.forEach(event => window.addEventListener(event, resetTimer));
        return () => {
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [resetTimer]);
};

export default useAutoLogout;