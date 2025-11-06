import { api } from '@/composables/useAuth';

export const invoicesApi = {
    async list(page = 1, perPage = 5) {
        const response = await api.get('/invoices', {
            params: { page, per_page: perPage }
        });
        return response.data;
    },
    
    async show(id) {
        const response = await api.get(`/invoices/${id}`);
        return response.data;
    },
    
    async create(data) {
        const response = await api.post('/invoices', data);
        return response.data;
    },
    
    async send(id) {
        const response = await api.post(`/invoices/${id}/send`);
        return response.data;
    },
    
    async cancel(id) {
        await api.delete(`/invoices/${id}`);
    }
};

