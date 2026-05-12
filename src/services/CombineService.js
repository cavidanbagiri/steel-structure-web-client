// services/CombineService.js
import $api from "../http/api";

class CombineService {
    async fetchCombineData(params = {}) {
        try {
            const response = await $api.get("/combine/", { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default new CombineService();