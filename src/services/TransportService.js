import $api from "../http/api";

class TransportService {
    // Fetch transport data with pagination and filters
    async fetchTransportData(params = {}) {
        try {
            const response = await $api.get('/transport/fetch_transport_data', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // NEW: Fetch single transport by ID
    async fetchTransportById(id) {
        try {
            const response = await $api.get(`/transport/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Import transport data from Excel
    async importTransportData() {
        try {
            const response = await $api.post('/transport/import_static_transport_data');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Get unique values for filter dropdowns
    async getUniqueValues(columnName) {
        try {
            const response = await $api.get(`/transport/unique_values/${columnName}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Get all unique values for multiple columns (for filter initialization)
    async getFilterOptions() {
        try {
            const columns = ['structure_1', 'structure_2', 'area', 'location', 't_status', 'mark_name'];
            const promises = columns.map(column =>
                this.getUniqueValues(column).then(res => ({ [column]: res[column] }))
            );
            const results = await Promise.all(promises);
            return Object.assign({}, ...results);
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async createTransport(data) {
        try {
            const response = await $api.post('/transport/create_transport', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async updateTransport(id, data) {
        try {
            const response = await $api.put(`/transport/update_transport/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async deleteTransport(id) {
        try {
            const response = await $api.delete(`/transport/delete_transport/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

     // NEW: Insert erected record
    async insertToErected(data) {
        try {
            const response = await $api.post("/transport/insert_to_erected", data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}





export default new TransportService();