import axios from 'axios';
import { API_PREFIX } from './config';


const apiClient = axios.create({
    baseURL: API_PREFIX,
    withCredentials: true
});


apiClient.interceptors.response.use(response => response, async error => {

    const currentToken = localStorage.getItem('token');
    
    if (error.response && error.response.status === 401) {
        try {
            const refreshResponse = await axios.post(`${API_PREFIX}/authorize/refresh`, {}, { withCredentials: true });
            const newAccessToken = refreshResponse.data.access_token;
            window.dispatchEvent(new CustomEvent('token-update', { detail: { newToken: newAccessToken } }));
            // 新しいトークンでリクエストを再試行
            error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return apiClient(error.config);
        } catch (refreshError) {
            console.error('トークンのリフレッシュに失敗しました', refreshError);
            window.dispatchEvent(new CustomEvent('logout')); // ログアウトイベントをディスパッチ
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

export default apiClient;
