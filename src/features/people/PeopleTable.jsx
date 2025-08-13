import { useMemo, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
  Button,
  TablePagination,
  Skeleton,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllPeopleSortedQuery } from '../../services/swapiApi.js';
import { setPage } from './peopleSlice.js';
import { formatCm, formatEdited, formatKg } from '../../utils/formatters.js';
import VehiclesDialog from '../vehicles/VehiclesDialog.jsx';
import PersonDialog from './PersonDialog.jsx';
import ImageWithFallback from '../../components/ImageWithFallback.jsx';
import { characterImageFromUrl } from '../../utils/imageUrls.js';
import MobilePeopleList from './MobilePeopleList.jsx';

/** display the table skeleton rows while data loads */
function LoadingRows() {
  return Array.from({ length: 10 }).map((_, idx) => (
    <TableRow key={`skeleton-${idx}`}>
      <TableCell>
        <Skeleton width={180} />
      </TableCell>
      <TableCell>
        <Skeleton width={80} />
      </TableCell>
      <TableCell>
        <Skeleton width={80} />
      </TableCell>
      <TableCell>
        <Skeleton width={90} />
      </TableCell>
      <TableCell>
        <Skeleton width={160} />
      </TableCell>
      <TableCell align="right">
        <Skeleton width={120} />
      </TableCell>
    </TableRow>
  ));
}

/* highlight the matched search text in names */
function highlight(text, query) {
  if (!query) return text;
  const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(esc, 'ig');
  const parts = String(text).split(re);
  const matches = String(text).match(re);
  if (!matches) return text;
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    out.push(parts[i]);
    if (i < parts.length - 1) out.push(<mark key={i}>{matches[i]}</mark>);
  }
  return out;
}

/**
 * People Table
 * md+: renders a sticky MUI table
 * sm: renders card list (MobilePeopleList)
 * Data: RTK Query `getAllPeopleSorted({search})`
 * Pagination: client-side slice (10/page)
 */
export default function PeopleTable() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md')); // table on md+, cards on sm
  const dispatch = useDispatch();
  const { search, page } = useSelector((s) => s.people);

  // fetch all matches for current search
  const { data, isFetching, isError, error } = useGetAllPeopleSortedQuery({ search });

  // dialog state
  const [vehiclesOpen, setVehiclesOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handleOpenVehicles = (person) => {
    setSelectedPerson(person);
    setVehiclesOpen(true);
  };
  const handleOpenDetails = (person) => {
    setSelectedPerson(person);
    setDetailsOpen(true);
  };
  const handleCloseVehicles = () => setVehiclesOpen(false);
  const handleCloseDetails = () => setDetailsOpen(false);

  const results = data?.results ?? [];
  const total = data?.count ?? 0;

  // client-side pagination on the globally sorted array (10/page)
  const rowsPerPage = 10;
  const pageIndex = Math.max(0, page - 1);
  const start = pageIndex * rowsPerPage;
  const end = start + rowsPerPage;
  const visible = results.slice(start, end);

  // mobile (sm) render cards and same pagination control
  if (!isMdUp) {
    return (
      <Paper>
        <Box sx={{ p: 1.5 }}>
          {isFetching && (
            <Stack spacing={2}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={120} />
              ))}
            </Stack>
          )}

          {!isFetching && isError && (
            <Box p={2}>
              <Typography color="error">
                Failed to load people: {String(error?.status || '')}{' '}
                {String(error?.error || '')}
              </Typography>
            </Box>
          )}

          {!isFetching && !isError && visible.length === 0 && (
            <Box p={3} textAlign="center" color="text.secondary">
              <Typography>No results.</Typography>
            </Box>
          )}

          {!isFetching && !isError && visible.length > 0 && (
            <MobilePeopleList
              people={visible}
              onOpenDetails={handleOpenDetails}
              onOpenVehicles={handleOpenVehicles}
            />
          )}
        </Box>

        <TablePagination
          component="div"
          rowsPerPageOptions={[rowsPerPage]}
          labelRowsPerPage="Rows per page"
          rowsPerPage={rowsPerPage}
          count={total}
          page={pageIndex}
          onPageChange={(_e, newPage) => dispatch(setPage(newPage + 1))}
        />

        {/* the portaled dialogs are controlled here to share selectedPerson */}
        <VehiclesDialog
          open={vehiclesOpen}
          onClose={handleCloseVehicles}
          person={selectedPerson}
        />
        <PersonDialog
          open={detailsOpen}
          onClose={handleCloseDetails}
          person={selectedPerson}
        />
      </Paper>
    );
  }

  // Desktop (md+)
  return (
    <Paper>
      <TableContainer sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <Table size="medium" stickyHeader aria-label="Character table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Height</TableCell>
              <TableCell>Mass</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Edited</TableCell>
              <TableCell align="right">Vehicles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching && <LoadingRows />}

            {!isFetching && isError && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box p={2}>
                    <Typography color="error">
                      Failed to load people: {String(error?.status || '')}{' '}
                      {String(error?.error || '')}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {!isFetching && !isError && visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box p={3} textAlign="center" color="text.secondary">
                    <Typography>No results.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {!isFetching &&
              !isError &&
              visible.map((p) => {
                const vehicleCount =
                  (p.vehicles?.length || 0) + (p.starships?.length || 0);
                const imgSrc = characterImageFromUrl(p.url);
                return (
                  <TableRow key={p.url} hover>
                    <TableCell>
                      {/* Clickable name opens details */}
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        onClick={() => handleOpenDetails(p)}
                        role="button"
                        tabIndex={0}
                        sx={{
                          cursor: 'pointer',
                          '&:hover .nameText': { textDecoration: 'underline' },
                          outline: 'none',
                        }}
                      >
                        <ImageWithFallback
                          src={imgSrc}
                          alt={p.name}
                          label={p.name}
                          size={32}
                          variant="circular"
                        />
                        <Typography className="nameText" fontWeight={600}>
                          {highlight(p.name, search)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{formatCm(p.height)}</TableCell>
                    <TableCell>{formatKg(p.mass)}</TableCell>
                    <TableCell>
                      <Chip
                        label={p.gender && p.gender !== 'n/a' ? p.gender : '—'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{formatEdited(p.edited)}</TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        {/* Count badge (vehicles + starships) */}
                        <Chip
                          label={`${vehicleCount}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            color: vehicleCount ? 'secondary.main' : 'text.disabled',
                            borderColor: vehicleCount ? 'secondary.main' : 'divider',
                          }}
                        />
                        {/* open vehicles dialog */}
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenVehicles(p)}
                          disabled={vehicleCount === 0}
                          disableRipple
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'common.black',
                            transition: 'background 0s',
                            '&:hover': { bgcolor: 'primary.main' },
                          }}
                        >
                          Show vehicles
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        rowsPerPageOptions={[rowsPerPage]}
        labelRowsPerPage="Rows per page"
        rowsPerPage={rowsPerPage}
        count={total}
        page={pageIndex}
        onPageChange={(_e, newPage) => dispatch(setPage(newPage + 1))}
      />

      {/* Shared dialogs controlled here */}
      <VehiclesDialog
        open={vehiclesOpen}
        onClose={handleCloseVehicles}
        person={selectedPerson}
      />
      <PersonDialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        person={selectedPerson}
      />
    </Paper>
  );
}
