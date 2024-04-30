import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import RegisterPage from '../pages/UserRegisterationPage';
import UserDeletePage from '../pages/UserDeletePage';
import Grading from '../pages/Grading';
import EditTestCase from '../pages/EditTestCase';
import { useAuth } from '../context/AuthContext';

const AdminRoutes: React.FC = () => {
    const navigate = useNavigate();
    const auth = useAuth();

    if (auth.token === null || auth.user_id === null || !auth.is_admin) {
        setTimeout(() => {
            navigate('/');
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
            <Route path="/grading/:problemNum" element={<Grading />} />
            <Route path="/edit/test_case/:problemNum/:subProblemNum" element={<EditTestCase />} />
            <Route path="/" element={<h1>管理者ページ</h1>} />
        </Routes>
    );
};

export default AdminRoutes;