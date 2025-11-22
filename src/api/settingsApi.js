import API from './client';

export const getAppSettings = async () => {
  try {
    const res = await API.get('/app/settings');

    const payload = res.data ?? {};

    let data = {};

    if (payload.data && typeof payload.data === 'object') {
      data = payload.data;
    } else if (typeof payload === 'object') {
      data = payload;
    }

    return {
      status: payload.status !== false,
      data,
    };
  } catch (err) {
    console.log('getAppSettings error:', err.message);
    return {status: false, data: {}, error: err.message};
  }
};
