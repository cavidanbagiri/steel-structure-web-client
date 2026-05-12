// stores/combine_slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CombineService from '../services/CombineService';

export const fetchCombineData = createAsyncThunk(
    'combine/fetchCombineData',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await CombineService.fetchCombineData(params);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    data: [],
    pagination: {
        total: 0,
        limit: 100,
        offset: 0,
        next_offset: null
    },
    filters: {
        main_area: null,
        main_zone: null,
        main_item: null,
        transport_status: null,
        transport_date_from: null,
        transport_date_to: null,
        erected_date_from: null,
        erected_date_to: null,
        search: null
    },
    loading: false,
    error: null
};

const combineSlice = createSlice({
    name: 'combine',
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
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCombineData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCombineData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data || [];
                if (action.payload.pagination) {
                    state.pagination = {
                        total: action.payload.pagination.total || 0,
                        limit: action.payload.pagination.limit || 100,
                        offset: action.payload.pagination.offset || 0,
                        next_offset: action.payload.pagination.next_offset || null
                    };
                }
            })
            .addCase(fetchCombineData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = [];
            });
    }
});

export const {
    setFilters,
    resetFilters,
    setPagination,
    clearError
} = combineSlice.actions;

export const selectCombineData = (state) => state.combine.data;
export const selectCombineLoading = (state) => state.combine.loading;
export const selectCombineError = (state) => state.combine.error;
export const selectCombinePagination = (state) => state.combine.pagination;
export const selectCombineFilters = (state) => state.combine.filters;

export default combineSlice.reducer;