import API from './client';

export const getCategories = async () => {
  try {
    const res = await API.get('/categories');
    const payload = res.data ?? {};

    let items = [];

    if (Array.isArray(payload)) {
      items = payload;
    } else if (Array.isArray(payload.data)) {
      items = payload.data;
    } else if (payload.categories && Array.isArray(payload.categories)) {
      items = payload.categories;
    }

    return {
      status: payload.status !== false,
      items,
    };
  } catch (err) {
    console.log('getCategories error:', err.message);
    return {status: false, items: [], error: err.message};
  }
};
