// services/main_service.js
import $api from "../http/api";

class MainService {
    async fetchMainData(params = {}) {
        try {
            const response = await $api.get("/main/fetch_main_data", { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async fetchUniqueValues(columnName) {
        try {
            const response = await $api.get("/main/fetch_main_data_unique_values", { 
                params: { column_name: columnName } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async fetchStatistics() {
        try {
            const response = await $api.get("/main/fetch_main_data_statistics");
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default new MainService();