import { createSlice, createAsyncThunk, createSelector  } from '@reduxjs/toolkit';
import TransportService from "../services/TransportService";

// Async Thunks
export const fetchTransportData = createAsyncThunk(
    'transport/fetchTransportData',
    async (params, { rejectWithValue }) => {
        try {
            const response = await TransportService.fetchTransportData(params);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchTransportById = createAsyncThunk(
    'transport/fetchTransportById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await TransportService.fetchTransportById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const importTransportData = createAsyncThunk(
    'transport/importTransportData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await TransportService.importTransportData();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchFilterOptions = createAsyncThunk(
    'transport/fetchFilterOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await TransportService.getFilterOptions();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createTransport = createAsyncThunk(
    'transport/createTransport',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await TransportService.createTransport(data);
            // Refresh the list after successful creation
            await dispatch(fetchTransportData({ limit: 100, offset: 0 }));
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateTransport = createAsyncThunk(
    'transport/updateTransport',
    async ({ id, data }, { rejectWithValue, dispatch }) => {
        try {
            const response = await TransportService.updateTransport(id, data);
            // Refresh the list after successful update
            await dispatch(fetchTransportData({ limit: 100, offset: 0 }));
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteTransport = createAsyncThunk(
    'transport/deleteTransport',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await TransportService.deleteTransport(id);
            // Refresh the list after successful deletion
            await dispatch(fetchTransportData({ limit: 100, offset: 0 }));
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


// Initial State
const initialState = {
    // Data
    items: [],
    currentItem: null,

    // Pagination
    total: 0,
    limit: 100,
    offset: 0,

    // Filters
    filters: {
        structure_1: null,
        structure_2: null,
        mark_name: null,
        order_no: null,
        area: null,
        location: null,
        t_status: null,
        t_date_from: null,
        t_date_to: null,
        min_weight: null,
        max_weight: null,
        search: null
    },

    // Filter options for dropdowns
    filterOptions: {
        structure_1: [],
        structure_2: [],
        area: [],
        location: [],
        t_status: [],
        mark_name: []
    },

    // UI States
    loading: false,
    importing: false,
    error: null,
    importResult: null,

    // Pagination metadata
    hasMore: false,
    currentPage: 0
};

// Slice
const transportSlice = createSlice({
    name: 'transport',
    initialState,
    reducers: {
        // Set filters
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.offset = 0; // Reset pagination when filters change
            state.currentPage = 0;
        },

        // Clear all filters
        clearFilters: (state) => {
            state.filters = initialState.filters;
            state.offset = 0;
            state.currentPage = 0;
        },

        
        setPagination: (state, action) => {
            if (action.payload.limit !== undefined) state.limit = action.payload.limit;
            if (action.payload.offset !== undefined) state.offset = action.payload.offset;
            if (action.payload.page !== undefined) state.currentPage = action.payload.page;
        },

        // Next page
        nextPage: (state) => {
            state.offset += state.limit;
            state.currentPage += 1;
        },

        // Previous page
        prevPage: (state) => {
            if (state.offset >= state.limit) {
                state.offset -= state.limit;
                state.currentPage -= 1;
            }
        },

        // Reset state
        resetTransport: () => initialState,

        // Clear current item
        clearCurrentItem: (state) => {
            state.currentItem = null;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Set single filter
        setFilter: (state, action) => {
            const { key, value } = action.payload;
            state.filters[key] = value;
            state.offset = 0;
            state.currentPage = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Transport Data
            .addCase(fetchTransportData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransportData.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.limit = action.payload.limit;
                state.offset = action.payload.offset;
                state.hasMore = state.offset + state.limit < state.total;
            })
            .addCase(fetchTransportData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Transport By ID
            .addCase(fetchTransportById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransportById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
            })
            .addCase(fetchTransportById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Import Transport Data
            .addCase(importTransportData.pending, (state) => {
                state.importing = true;
                state.error = null;
                state.importResult = null;
            })
            .addCase(importTransportData.fulfilled, (state, action) => {
                state.importing = false;
                state.importResult = action.payload;
            })
            .addCase(importTransportData.rejected, (state, action) => {
                state.importing = false;
                state.error = action.payload;
            })

            // Fetch Filter Options
            .addCase(fetchFilterOptions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFilterOptions.fulfilled, (state, action) => {
                state.loading = false;
                state.filterOptions = { ...state.filterOptions, ...action.payload };
            })
            .addCase(fetchFilterOptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Transport
            .addCase(createTransport.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTransport.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createTransport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Transport
            .addCase(updateTransport.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTransport.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateTransport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Transport
            .addCase(deleteTransport.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteTransport.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteTransport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export actions
export const {
    setFilters,
    clearFilters,
    setPagination,
    nextPage,
    prevPage,
    resetTransport,
    clearCurrentItem,
    clearError,
    setFilter
} = transportSlice.actions;

// Selectors
export const selectTransportItems = (state) => state.transport.items;
export const selectCurrentItem = (state) => state.transport.currentItem;
export const selectTransportLoading = (state) => state.transport.loading;
export const selectTransportError = (state) => state.transport.error;
export const selectTransportTotal = (state) => state.transport.total;
export const selectTransportFilters = (state) => state.transport.filters
// export const selectPagination = (state) => ({
//     limit: state.transport.limit,
//     offset: state.transport.offset,
//     total: state.transport.total,
//     hasMore: state.transport.hasMore,
//     currentPage: state.transport.currentPage
// });
export const selectTransportLimit = (state) => state.transport.limit;
export const selectTransportOffset = (state) => state.transport.offset;
export const selectTransportHasMore = (state) => state.transport.hasMore;
export const selectTransportCurrentPage = (state) => state.transport.currentPage;
export const selectFilterOptions = (state) => state.transport.filterOptions;
export const selectImporting = (state) => state.transport.importing;
export const selectImportResult = (state) => state.transport.importResult;

// export const selectImportStatus = (state) => ({
//     importing: state.transport.importing,
//     importResult: state.transport.importResult
// });


export const selectPagination = createSelector(
    [
        selectTransportLimit,
        selectTransportOffset,
        selectTransportTotal,
        selectTransportHasMore,
        selectTransportCurrentPage,
    ],
    (limit, offset, total, hasMore, currentPage) => ({
        limit,
        offset,
        total,
        hasMore,
        currentPage,
    })
);

export const selectImportStatus = createSelector(
    [selectImporting, selectImportResult],
    (importing, importResult) => ({
        importing,
        importResult,
    })
);

// Export reducer
export default transportSlice.reducer;