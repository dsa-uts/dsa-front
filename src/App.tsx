import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import SubmissionPage from './pages/SubmissionPage';
import LoginPage from './pages/LoginPage';
import AdminRoutes from './routes/AdminRoutes';
import { AuthProvider, useAuth } from './context/AuthContext';


const App: React.FC = () => {
	// const { resetTimer } = useAuth(); // useAuthフックからresetTimer関数を取得
    // useEffect(() => {
    //     const events = ['click', 'load', 'keydown'];
    //     // イベントリスナーを追加
    //     events.forEach(event => window.addEventListener(event, resetTimer));
        
    //     // クリーンアップ関数
    //     return () => {
    //         events.forEach(event => window.removeEventListener(event, resetTimer));
    //     };
    // }, [resetTimer]);

    return (
		<Router>
			<AuthProvider>
				<div className="app">
					<Sidebar />
					<div className="content">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/submission/:problemNum" element={<SubmissionPage />} />
							<Route path="/login" element={<LoginPage />} />
							<Route path="/admin/*" element={<AdminRoutes />} />
							<Route path="*" element={<h1>Not Found</h1>} />
						</Routes>
					</div>
				</div>
			</AuthProvider>
		</Router>
    );
};

export default App;
