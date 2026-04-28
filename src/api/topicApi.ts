import apiClient from "./axios";

export interface TrendingTopic {
    id?: number;
    name: string;
    searches: number;
    color: string;
    light_bg: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface SearchKeyword {
    id: number;
    keyword: string;
    count: number;
    updated_at: string;
}

export const fetchTopics = () => {
    return apiClient.get<TrendingTopic[]>('/topics/');
};

export const createTopic = (data: Partial<TrendingTopic>) => {
    return apiClient.post<TrendingTopic>('/topics/', data);
};

export const updateTopic = (id: number, data: Partial<TrendingTopic>) => {
    return apiClient.patch<TrendingTopic>(`/topics/${id}/`, data);
};

export const deleteTopic = (id: number) => {
    return apiClient.delete(`/topics/${id}/`);
};

export const fetchTopSearches = () => {
    return apiClient.get<SearchKeyword[]>('/topics/top-searches/');
};
