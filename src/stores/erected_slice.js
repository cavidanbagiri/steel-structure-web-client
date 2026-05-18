// stores/erected_slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ErectedService from '../services/ErectedService';

// Async thunks
export const fetchErectedData = createAsyncThunk(
    'erected/fetchErectedData',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await ErectedService.fetchErectedData(params);
            console.log('the erected response from slice is ', response)
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchErectedUniqueValues = createAsyncThunk(
    'erected/fetchErectedUniqueValues',
    async (columnName, { rejectWithValue }) => {
        try {
            const response = await ErectedService.fetchUniqueValues(columnName);
            return { columnName, data: response };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchErectedStatistics = createAsyncThunk(
    'erected/fetchErectedStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await ErectedService.fetchStatistics();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    data: [],
    statistics: null,
    uniqueValues: {},
    pagination: {
        total: 0,
        limit: 100,
        offset: 0
    },
    filters: {
        area: null,
        structure: null,
        row_labels: null,
        mark_names: null,
        altitude_mark_1: null,
        axis: null,
        range: null,
        altitude_mark_2: null,
        min_e_qty: null,
        max_e_qty: null,
        min_e_weight: null,
        max_e_weight: null,
        min_proce_qty: null,
        max_proce_qty: null,
        daily_e_date_from: null,
        daily_e_date_to: null,
        search: null
    },
    loading: false,
    fetchingStats: false,
    error: null
};

const erectedSlice = createSlice({
    name: 'erected',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.offset = 0;
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
            state.pagination.offset = 0;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        resetPagination: (state) => {
            state.pagination.offset = 0;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchErectedData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchErectedData.fulfilled, (state, action) => {
                state.loading = false;
                console.log('actio payload data ', action.payload)
                state.data = action.payload.data || [];
                state.pagination.limit = action.payload.pagination.limit
                state.pagination.total = action.payload.pagination.total

            })
            .addCase(fetchErectedData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = [];
            })
            .addCase(fetchErectedStatistics.pending, (state) => {
                state.fetchingStats = true;
                state.error = null;
            })
            .addCase(fetchErectedStatistics.fulfilled, (state, action) => {
                state.fetchingStats = false;
                state.statistics = action.payload;
            })
            .addCase(fetchErectedStatistics.rejected, (state, action) => {
                state.fetchingStats = false;
                state.error = action.payload;
            })
            .addCase(fetchErectedUniqueValues.fulfilled, (state, action) => {
                const values = action.payload.data.values || [];
                state.uniqueValues[action.payload.columnName] = values;
            })
            .addCase(fetchErectedUniqueValues.rejected, (state, action) => {
                state.uniqueValues[action.meta.arg] = [];
            });
    }
});

export const {
    setFilters,
    resetFilters,
    setPagination,
    resetPagination,
    clearError
} = erectedSlice.actions;

// Selectors
export const selectErectedData = (state) => state.erected.data;
export const selectErectedLoading = (state) => state.erected.loading;
export const selectErectedError = (state) => state.erected.error;
export const selectErectedPagination = (state) => state.erected.pagination;
export const selectErectedFilters = (state) => state.erected.filters;
export const selectErectedStatistics = (state) => state.erected.statistics;
export const selectErectedUniqueValues = (state, columnName) => state.erected.uniqueValues[columnName] || [];

export default erectedSlice.reducer;