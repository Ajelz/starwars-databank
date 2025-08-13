// src/components/GlobalProgress.jsx
import { LinearProgress, Box, Fade } from '@mui/material';
import { useSelector } from 'react-redux';
import { swapiApi } from '../services/swapiApi.js';

export default function GlobalProgress() {
  // counts all pending rtk queries+ mutations
  const fetching = useSelector((state) => {
    const apiState = state[swapiApi.reducerPath];
    if (!apiState) return 0;
    const queries = apiState.queries ?? {};
    const mutations = apiState.mutations ?? {};
    let inFlight = 0;
    for (const q of Object.values(queries)) if (q?.status === 'pending') inFlight++;
    for (const m of Object.values(mutations)) if (m?.status === 'pending') inFlight++;
    return inFlight;
  });

  const show = fetching > 0;

  return (
    <Fade in={show} unmountOnExit>
      <Box sx={{ position: 'sticky', top: 0, zIndex: (t) => t.zIndex.appBar + 1 }}>
        <LinearProgress />
      </Box>
    </Fade>
  );
}
