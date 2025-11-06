import { api } from '@/composables/useAuth';

export const paymentsApi = {
    async create(invoiceId, amount) {
        const response = await api.post(`/invoices/${invoiceId}/payments`, {
            amount: parseFloat(amount)
        });
        return response.data;
    },
    
    async delete(invoiceId, paymentId) {
        await api.delete(`/invoices/${invoiceId}/payments/${paymentId}`);
    }
};

