import API from './client';

export const getProducts = async (page = 1, extraParams = {}) => {
    try {
        const res = await API.get('/products', {
            params: {
                page,
                ...extraParams,
            },
        });

        const payload = res.data ?? {};

        let items = [];

        // 1) If the whole payload is an array
        if (Array.isArray(payload)) {
            items = payload;
        }

        // 2) If payload.data is an array
        else if (Array.isArray(payload.data)) {
            items = payload.data;
        }

        // 3) If payload.data.data is an array (Laravel paginator with resource collection)
        else if (payload.data && Array.isArray(payload.data.data)) {
            items = payload.data.data;
        }

        // 4) If payload.products is an array (fallback)
        else if (Array.isArray(payload.products)) {
            items = payload.products;
        }

        const meta =
            payload.meta ||
            (payload.data && payload.data.meta) ||
            null;

        return {
            status: payload.status !== false,
            items,
            meta,
        };
    } catch (err) {
        console.log('getProducts error:', err.message);
        return { status: false, items: [], meta: null, error: err.message };
    }
};

export const getTrendingProducts = async () => {
    try {
        const res = await API.get('/products/trending');

        const payload = res.data ?? {};

        let items = [];

        if (Array.isArray(payload)) {
            items = payload;
        } else if (Array.isArray(payload.data)) {
            items = payload.data;
        } else if (payload.data && Array.isArray(payload.data.data)) {
            items = payload.data.data;
        } else if (Array.isArray(payload.products)) {
            items = payload.products;
        }

        return {
            status: payload.status !== false,
            items,
        };
    } catch (err) {
        console.log('getTrendingProducts error:', err.message);
        return { status: false, items: [], error: err.message };
    }
};

export const getProductById = async id => {
    try {
        const res = await API.get(`/products/${id}`);

        const payload = res.data ?? {};

        // Your API returns {status: true, data: {...product...}}
        let item = null;

        if (payload.data && typeof payload.data === 'object') {
            item = payload.data;
        } else if (payload.product) {
            item = payload.product;
        } else if (!payload.data && !payload.product && typeof payload === 'object') {
            item = payload; // in case it returns object directly
        }
        return {
            status: payload.status !== false,
            item,
        };
    } catch (err) {
        console.log('getProductById error:', err.message);
        return { status: false, item: null, error: err.message };
    }
};