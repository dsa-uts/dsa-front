import axios from 'axios';
import { LoginCredentials, CreateUser } from '../../types/user';
import { Token } from '../../types/token';
import apiClient from '../ApiClient';

interface UploadResult {
    unique_id: string;
    filename: string;
    result: string;
}

const API_PREFIX = 'http://localhost:8000/api/v1';
// ファイルをアップロードする関数(多分uploadFileWithProgressに切り替える)
export const uploadFile = async (file: File, id: number, sub_id: number): Promise<UploadResult> =>{
    const formData = new FormData();
    formData.append("upload_file", file);
    try {
        const response = await axios.post(`${API_PREFIX}/assignments/upload/${id}/${sub_id}`, formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });
        const data: UploadResult = response.data;
        return data; // uuidが付加されたファイル名を返す
    } catch (error) {
        throw error; // エラーを呼び出し元に伝播させる
    }
};

export const updateMakefile = async (makefile: string, id: number, sub_id: number, token: string | null): Promise<string> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await apiClient.post(`${API_PREFIX}/edit/makefile/${id}/${sub_id}`, { makefile }, { headers });
        return response.data.result;
    } catch (error) {
        throw error;
    }
}

export const updateExpectedOutput = async (expected_output: string, id: number, sub_id: number, token: string | null): Promise<string> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await apiClient.post(`${API_PREFIX}/edit/expected_output/${id}/${sub_id}`, { expected_output }, { headers });
        return response.data.result;
    } catch (error) {
        throw error;
    }
}

// 
export const createUser = async (user: CreateUser, token: string | null): Promise<string> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await apiClient.post(`${API_PREFIX}/users/register`, user, { headers });
        return response.data.result;
    } catch (error) {
        throw error;
    }
}

// ログイン関数
export const login = async (credentials: LoginCredentials): Promise<Token> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    try {
        const response = await apiClient.post<Token>(`${API_PREFIX}/authorize/token`, formData);
        return response.data; 
    } catch (error) {
        throw error;
    }
}

export const logout = async (token: string): Promise<void> => {
    try {
        const headers = { Authorization: `Bearer ${token}` };
        await apiClient.post(`${API_PREFIX}/authorize/logout`, {}, { headers });
    } catch (error) {
        throw error;
    }
}