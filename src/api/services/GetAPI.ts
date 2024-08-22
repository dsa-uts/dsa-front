import axios from 'axios';
import { Assignment, SubAssignmentDropdown, SubAssignmentDetail } from '../../types/Assignments';
import { User } from '../../types/user';
import apiClient from '../ApiClient';

// APIから課題データを取得する関数
export const fetchAssignments = async (token: string | null): Promise<Assignment[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await apiClient.get('/assignments/', { headers });
        return response.data;
    } catch (error) {
        console.error('課題データの取得に失敗しました', error);
        throw new Error('課題データの取得に失敗しました');
    }
};

// APIから課題中の基本課題と発展課題を取得する関数
export const fetchSubAssignments = async (id: string, token: string | null): Promise<SubAssignmentDropdown[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await apiClient.get(`/assignments/${id}`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// APIからドロップダウンで選択された課題の詳細情報を取得する関数
export const fetchSubAssignmentDetail = async (id: string, sub_id: string, token: string | null): Promise<SubAssignmentDetail | null> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await apiClient.get(`/assignments/${id}/${sub_id}`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchUserList = async (token: string | null): Promise<User[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await apiClient.get('/users/all', { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};
