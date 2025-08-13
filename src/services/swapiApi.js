import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithFallback } from './baseQueryWithFallback.js';

const PRIMARY = import.meta.env.VITE_SWAPI_BASE_URL || 'https://swapi.py4e.com/api/';
const FALLBACK = import.meta.env.VITE_SWAPI_FALLBACK_BASE_URL || '';

export const swapiApi = createApi({
  reducerPath: 'swapiApi',
  baseQuery: createBaseQueryWithFallback(PRIMARY, FALLBACK),
  tagTypes: ['People', 'Vehicle'],
  endpoints: (builder) => ({
    // Server-paginatation
    getPeople: builder.query({
      query: ({ search = '', page = 1 } = {}) => {
        const qp = new URLSearchParams();
        if (search) qp.set('search', search);
        if (page) qp.set('page', String(page));
        const suffix = qp.toString() ? `?${qp}` : '';
        return `people/${suffix}`;
      },
      providesTags: [{ type: 'People', id: 'LIST' }],
    }),

    // Vehicles helpers
    getVehicleById: builder.query({
      query: (id) => `vehicles/${id}/`,
      providesTags: (result, _err, id) => [{ type: 'Vehicle', id }],
    }),

    getVehiclesByIds: builder.query({
      async queryFn(ids, _api, _extra, baseQuery) {
        if (!Array.isArray(ids) || ids.length === 0) return { data: [] };
        const fetches = await Promise.all(ids.map((id) => baseQuery(`vehicles/${id}/`)));
        const firstErr = fetches.find((r) => r.error);
        if (firstErr) return { error: firstErr.error };
        return { data: fetches.map((r) => r.data) };
      },
      providesTags: (result) =>
        Array.isArray(result) ? result.map((v) => ({ type: 'Vehicle', id: v?.url })) : [],
    }),

    // Global fetch and sort for people (we sort desc: vehicles + starships) & asc names
    getAllPeopleSorted: builder.query({
      async queryFn({ search = '' } = {}, _api, _extra, baseQuery) {
        const qp1 = new URLSearchParams();
        if (search) qp1.set('search', search);
        qp1.set('page', '1');

        const first = await baseQuery(`people/?${qp1.toString()}`);
        if (first.error) return { error: first.error };

        const count = first.data?.count ?? 0;
        const r1 = first.data?.results ?? [];
        const pageSize = 10;
        const totalPages = Math.max(1, Math.ceil(count / pageSize));

        let all = r1;
        if (totalPages > 1) {
          const promises = [];
          for (let p = 2; p <= totalPages; p++) {
            const q = new URLSearchParams();
            if (search) q.set('search', search);
            q.set('page', String(p));
            promises.push(baseQuery(`people/?${q.toString()}`));
          }
          const rest = await Promise.all(promises);
          const err = rest.find((r) => r.error);
          if (err) return { error: err.error };
          all = all.concat(...rest.map((r) => r.data?.results || []));
        }

        const sorted = all.slice().sort((a, b) => {
          const aVehicles = Array.isArray(a.vehicles) ? a.vehicles.length : 0;
          const aStarships = Array.isArray(a.starships) ? a.starships.length : 0;
          const bVehicles = Array.isArray(b.vehicles) ? b.vehicles.length : 0;
          const bStarships = Array.isArray(b.starships) ? b.starships.length : 0;
          const aTotal = aVehicles + aStarships;
          const bTotal = bVehicles + bStarships;
          if (bTotal !== aTotal) return bTotal - aTotal;
          return String(a.name).localeCompare(String(b.name));
        });

        return { data: { count: sorted.length, results: sorted } };
      },
      providesTags: [{ type: 'People', id: 'ALL' }],
      keepUnusedDataFor: 60,
    }),

    // fetch many by absolute URLs
    getManyByUrls: builder.query({
      async queryFn(urls, _api, _extra, baseQuery) {
        if (!Array.isArray(urls) || urls.length === 0) return { data: [] };
        const uniq = Array.from(new Set(urls.filter(Boolean)));
        const results = await Promise.all(uniq.map((u) => baseQuery(u)));
        const err = results.find((r) => r.error);
        if (err) return { error: err.error };
        return { data: results.map((r) => r.data) };
      },
    }),
  }),
});

export const {
  useGetPeopleQuery,
  useGetVehicleByIdQuery,
  useGetVehiclesByIdsQuery,
  useGetAllPeopleSortedQuery,
  useGetManyByUrlsQuery,
} = swapiApi;
