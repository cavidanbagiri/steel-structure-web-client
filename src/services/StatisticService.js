import $api from "../http/api";

class StatisticService {
    async fetchMainDataProjectStatistics() {
        try {
            const response = await $api.get('/statistic/fetch_main_data_project_statistics');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default new StatisticService();