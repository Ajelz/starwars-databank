import React, { useEffect, useState } from 'react';
import {
  Paper,
  TextField,
  InputAdornment,
  Typography,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch, setPage } from './peopleSlice.js';
import useDebounce from '../../hooks/useDebounce.js';
import PeopleTable from './PeopleTable.jsx';

export default function PeoplePage() {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const search = useSelector((s) => s.people.search);
  const page = useSelector((s) => s.people.page);

  const [localSearch, setLocalSearch] = useState(search);
  const debounced = useDebounce(localSearch, 400);

  // reads URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const pg = parseInt(params.get('page') || '1', 10);
    if (q !== null) {
      setLocalSearch(q);
      dispatch(setSearch(q.trim()));
    }
    if (!Number.isNaN(pg) && pg > 0) {
      dispatch(setPage(pg));
    }
  }, []);

  // pushes debounced search into Redux
  useEffect(() => {
    if (debounced.trim() !== search) {
      dispatch(setSearch(debounced.trim()));
    }
  }, [debounced, search, dispatch]);

  // keeps URL in sync
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (search) params.set('q', search);
    else params.delete('q');
    params.set('page', String(page));
    const qs = params.toString();
    const url = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [search, page]);

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: isSmDown ? 1.25 : 2 }}>
        <Stack spacing={isSmDown ? 1 : 1.5}>
          <Typography variant={isSmDown ? 'subtitle1' : 'h6'}>People</Typography>
          <TextField
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filter by name..."
            inputProps={{ 'aria-label': 'Filter by name' }}
            fullWidth
            autoComplete="off"
            size={isSmDown ? 'small' : 'medium'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize={isSmDown ? 'small' : 'medium'} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Paper>

      <PeopleTable />
    </Stack>
  );
}
