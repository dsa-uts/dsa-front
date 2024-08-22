import React, { useState } from 'react';
import { createUser } from '../api/services/PostAPI';
import { CreateUser } from '../types/user';
import {useAuth} from '../context/AuthContext';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [is_admin, setIsAdmin] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [activeStartDate, setActiveStartDate] = useState('');
    const [activeEndDate, setActiveEndDate] = useState('');
    const auth = useAuth();
    // const [authCode, setAuthCode] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('パスワードが一致しません。');
            return;
        }

        if (activeStartDate && activeEndDate && new Date(activeStartDate) > new Date(activeEndDate)) {
            setError('有効開始日時は有効終了日時より前でなければなりません。');
            return;
        }

        const newUser: CreateUser = {
            username,
            password,
            is_admin,
            disabled,
            active_start_date: activeStartDate || null, // 空文字列の場合はnullを設定
            active_end_date: activeEndDate || null, // 空文字列の場合はnullを設定
            // auth_code: '', // auth_codeは空文字列で設定
        };

        try {
            await createUser(newUser, auth.token);
            alert('アカウントが正常に作成されました。');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setIsAdmin(false);
            setDisabled(false);
            setActiveStartDate('');
            setActiveEndDate('');
            setError('');
            // 登録後の処理（例：ログインページへのリダイレクト）
        } catch (error) {
            console.error('アカウントの作成に失敗しました。', error);
            setError(`アカウントの作成に失敗しました: ${(error as any).response.data.detail}`);
        }
    };

    if (auth.user_id === null) {
        return <p>ログインしていません。</p>;
    }
    if (!auth.is_admin) {
        return <p>管理者権限がありません。</p>;
    }

    return (
        <div>
            <h2>アカウント登録</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <div>
                    <label>ユーザー名:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>パスワード:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>パスワード確認:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <div>
                    <label>管理者:</label>
                    <input type="radio" name="is_admin" value="true" onChange={() => setIsAdmin(true)} /> はい
                    <input type="radio" name="is_admin" value="false" onChange={() => setIsAdmin(false)} checked /> いいえ
                </div>
                {/* <div>
                    <label>有効化: </label>
                    <input type="radio" name="disabled" value="true" onChange={() => setDisabled(true)} /> はい
                    <input type="radio" name="disabled" value="false" onChange={() => setDisabled(false)} checked /> いいえ
                </div> */}
                <div>
                    <label>有効開始日時:</label>
                    <input type="datetime-local" value={activeStartDate} onChange={(e) => setActiveStartDate(e.target.value)} />
                    <small>指定しない場合は無期限として扱われます。</small>
                </div>
                <div>
                    <label>有効終了日時:</label>
                    <input type="datetime-local" value={activeEndDate} onChange={(e) => setActiveEndDate(e.target.value)} />
                    <small>指定しない場合は無期限として扱われます。</small>
                </div>
                <button type="submit">登録</button>
            </form>
        </div>
    );
};

export default RegisterPage;