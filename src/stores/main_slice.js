// stores/main_slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MainService from '../services/MainService';

// Async thunks
export const fetchMainData = createAsyncThunk(
    'main/fetchMainData',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await MainService.fetchMainData(params);
            // Expecting response structure: { success: true, data: [], pagination: {}, filters_applied: {} }
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUniqueValues = createAsyncThunk(
    'main/fetchUniqueValues',
    async (columnName, { rejectWithValue }) => {
        try {
            const response = await MainService.fetchUniqueValues(columnName);
            // Expecting response structure: { success: true, values: [], column: "area" }
            return { columnName, data: response };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchStatistics = createAsyncThunk(
    'main/fetchStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await MainService.fetchStatistics();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Load column visibility from localStorage
const loadColumnVisibility = () => {
    const saved = localStorage.getItem('main_column_visibility');
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        id: true,
        area: true,
        zone: true,
        key: true,
        row_labels: true,
        item: true,
        p_s: true,
        qty: true,
        left_over_qty: true,
        description: true,
        section: true,
        length: true,
        weight: true,
        weight_total: true,
        dwgn: true
    };
};

const initialState = {
    // Data states
    data: [],
    statistics: null,
    uniqueValues: {},
    
    // Column visibility
    columnVisibility: loadColumnVisibility(),
    
    // Pagination
    pagination: {
        total: 0,
        limit: 100,
        offset: 0
    },
    
    // Filters
    filters: {
        area: null,
        zone: null,
        key: null,
        row_labels: null,
        item: null,
        p_s: null,
        section: null,
        dwgn: null,
        min_qty: null,
        max_qty: null,
        min_length: null,
        max_length: null,
        min_weight: null,
        max_weight: null,
        min_weight_total: null,
        max_weight_total: null,
        search: null
    },
    
    // Loading states
    loading: false,
    fetchingStats: false,
    
    // Error states
    error: null
};

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.offset = 0; // Reset pagination when filters change
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
        },
        toggleColumn: (state, action) => {
            const columnName = action.payload;
            state.columnVisibility[columnName] = !state.columnVisibility[columnName];
            localStorage.setItem('main_column_visibility', JSON.stringify(state.columnVisibility));
        },
        setColumnVisibility: (state, action) => {
            state.columnVisibility = { ...state.columnVisibility, ...action.payload };
            localStorage.setItem('main_column_visibility', JSON.stringify(state.columnVisibility));
        },
        resetColumnVisibility: (state) => {
            state.columnVisibility = initialState.columnVisibility;
            localStorage.setItem('main_column_visibility', JSON.stringify(state.columnVisibility));
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Main Data
            .addCase(fetchMainData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // .addCase(fetchMainData.fulfilled, (state, action) => {
            //     state.loading = false;
            //     // Handle response structure: { success: true, data: [], pagination: {}, filters_applied: {} }
            //     state.data = action.payload.data || [];
            //     if (action.payload.pagination) {
            //         state.pagination = {
            //             // total: action.payload.pagination.total || 0,
            //             limit: action.payload.pagination.limit || 100,
            //             // offset: action.payload.pagination.offset || 0
            //         };
            //     }
            // })
            .addCase(fetchMainData.fulfilled, (state, action) => {
                state.loading = false;

                state.data = action.payload.data || [];

                if (action.payload.pagination) {
                    state.pagination.total =
                        action.payload.pagination.total || 0;
                }
            })
            .addCase(fetchMainData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = [];
            })
            
            // Fetch Statistics
            .addCase(fetchStatistics.pending, (state) => {
                state.fetchingStats = true;
                state.error = null;
            })
            .addCase(fetchStatistics.fulfilled, (state, action) => {
                state.fetchingStats = false;
                state.statistics = action.payload;
            })
            .addCase(fetchStatistics.rejected, (state, action) => {
                state.fetchingStats = false;
                state.error = action.payload;
            })
            
            // Fetch Unique Values
            .addCase(fetchUniqueValues.fulfilled, (state, action) => {
                // Handle response: { values: [], column: "area" }
                const values = action.payload.data.values || [];
                state.uniqueValues[action.payload.columnName] = values;
            })
            .addCase(fetchUniqueValues.rejected, (state, action) => {
                console.error(`Failed to fetch unique values:`, action.payload);
                state.uniqueValues[action.meta.arg] = [];
            });
    }
});

export const { 
    setFilters, 
    resetFilters, 
    setPagination, 
    resetPagination,
    clearError,
    toggleColumn,
    setColumnVisibility,
    resetColumnVisibility
} = mainSlice.actions;

// Selectors
export const selectMainData = (state) => state.main.data;
export const selectMainLoading = (state) => state.main.loading;
export const selectMainError = (state) => state.main.error;
export const selectMainPagination = (state) => state.main.pagination;
export const selectMainFilters = (state) => state.main.filters;
export const selectMainStatistics = (state) => state.main.statistics;
// export const selectUniqueValues = (state, columnName) => state.main.uniqueValues[columnName] || [];
const EMPTY_ARRAY = [];

export const selectUniqueValues = (state, columnName) =>
    state.main.uniqueValues[columnName] || EMPTY_ARRAY;
export const selectColumnVisibility = (state) => state.main.columnVisibility;

export default mainSlice.reducer;