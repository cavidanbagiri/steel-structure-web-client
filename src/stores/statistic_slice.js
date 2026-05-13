import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import StatisticService from '../services/StatisticService';

export const fetchMainDataProjectStatistics = createAsyncThunk(
    'statistic/fetchMainDataProjectStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await StatisticService.fetchMainDataProjectStatistics();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    data: null,
    loading: false,
    error: null,
    success: false,
};

const statisticSlice = createSlice({
    name: 'statistic',
    initialState,
    reducers: {
        clearStatisticState: (state) => {
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMainDataProjectStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchMainDataProjectStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.success = true;
                state.error = null;
            })
            .addCase(fetchMainDataProjectStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch statistics';
                state.success = false;
                state.data = null;
            });
    },
});

export const { clearStatisticState } = statisticSlice.actions;
export default statisticSlice.reducer;