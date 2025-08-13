/**
 * Base query wrapper: we try PRIMARY first; on network failure (FETCH_ERROR) try FALLBACK (4xx & 5xx dont trigger)
 */
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setApiHost } from '../features/system/systemSlice.js';

export const createBaseQueryWithFallback = (primaryBaseUrl, fallbackBaseUrl) => {
  const primary = fetchBaseQuery({ baseUrl: primaryBaseUrl });
  const fallback = fallbackBaseUrl ? fetchBaseQuery({ baseUrl: fallbackBaseUrl }) : null;
  /*  shows the current host + "(fallback)" in the AppBar. */
  return async (args, api, extraOptions) => {
    const res = await primary(args, api, extraOptions);
    if (!res.error) {
      api.dispatch(setApiHost({ baseUrl: primaryBaseUrl, usingFallback: false }));
      return res;
    }
    if (res.error?.status === 'FETCH_ERROR' && fallback) {
      const second = await fallback(args, api, extraOptions);
      if (!second.error) {
        api.dispatch(setApiHost({ baseUrl: fallbackBaseUrl, usingFallback: true }));
      }
      return second;
    }
    return res;
  };
};
