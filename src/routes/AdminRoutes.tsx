import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from '../pages/UserRegisterationPage';
import UserDeletePage from '../pages/UserDeletePage';
import { useAuth } from '../context/AuthContext';

const AdminRoutes: React.FC = () => {
    const auth = useAuth();

    if (auth.token === null || auth.user_id === null || !auth.is_admin) {
        setTimeout(() => {
            window.location.href = "/";
        }, 3000);
        return (
            <div>
                <h1>アクセス権限がありません (エラー: 401)</h1>
                <p>3秒後にホームページにリダイレクトされます．リダイレクトされない場合は，<a href="/">こちらをクリックしてください</a>．</p>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/users/register" element={<RegisterPage />} />
            <Route path="/users/delete" element={<UserDeletePage />} />
            <Route path="/" element={<h1>管理者ページ</h1>} />
        </Routes>
    );
};

export default AdminRoutes;