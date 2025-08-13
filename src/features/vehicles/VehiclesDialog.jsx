import React, { useMemo, useState, Fragment } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
  Box,
  Typography,
  Skeleton,
  Chip,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useGetManyByUrlsQuery } from '../../services/swapiApi.js';
import { vehicleImageFromUrl, starshipImageFromUrl } from '../../utils/imageUrls.js';

/** small placeholder for the vehicle row */
function CraftThumb({ src, alt, width = 120, maxHeight = 90 }) {
  const [error, setError] = useState(false);
  const letter = (alt || '').trim().charAt(0).toUpperCase() || '?';

  // letter fallback when src is missing
  if (!src || error) {
    return (
      <Box
        aria-label={`${alt} placeholder`}
        sx={{
          width,
          height: maxHeight,
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          color: 'text.secondary',
          fontWeight: 700,
          border: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        {letter}
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => setError(true)}
      sx={{
        width,
        maxHeight,
        height: 'auto',
        objectFit: 'contain',
        display: 'block',
        borderRadius: 1.5,
        p: 0.5,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        flexShrink: 0,
      }}
    />
  );
}

export default function VehiclesDialog({ open, onClose, person }) {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  // stabilize url arrays so that queries don't refire unnecessarily
  const vehicleUrls = useMemo(() => person?.vehicles ?? [], [person]);
  const starshipUrls = useMemo(() => person?.starships ?? [], [person]);

  // fetch only while the dialog is open
  const {
    data: vehicles = [],
    isFetching: isFetchingVehicles,
    isError: isVehiclesError,
    error: vehiclesError,
  } = useGetManyByUrlsQuery(vehicleUrls, { skip: !open });

  const {
    data: starships = [],
    isFetching: isFetchingStarships,
    isError: isStarshipsError,
    error: starshipsError,
  } = useGetManyByUrlsQuery(starshipUrls, { skip: !open });

  const name = person?.name || '';
  const vCount = vehicles.length;
  const sCount = starships.length;
  const totalCount = vCount + sCount;

  // render one vehicle/starship row with chips for specs
  const renderCraftRow = (craft, type) => {
    const src =
      type === 'vehicle'
        ? vehicleImageFromUrl(craft.url)
        : starshipImageFromUrl(craft.url);

    return (
      <ListItem
        key={craft.url}
        alignItems="flex-start"
        disableGutters
        sx={{ py: 1.25, gap: 2 }}
      >
        <CraftThumb src={src} alt={craft.name} width={112} maxHeight={84} />
        <ListItemText
          primary={
            <Typography fontWeight={700}>
              {craft.name} — {craft.model}
            </Typography>
          }
          secondary={
            <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap" useFlexGap>
              {'manufacturer' in craft && (
                <Chip
                  label={`Manufacturer: ${craft.manufacturer}`}
                  size="small"
                  variant="outlined"
                />
              )}
              {'vehicle_class' in craft && (
                <Chip
                  label={`Class: ${craft.vehicle_class}`}
                  size="small"
                  variant="outlined"
                />
              )}
              {'starship_class' in craft && (
                <Chip
                  label={`Class: ${craft.starship_class}`}
                  size="small"
                  variant="outlined"
                />
              )}
              {'max_atmosphering_speed' in craft &&
                craft.max_atmosphering_speed !== 'unknown' && (
                  <Chip
                    label={`Speed: ${craft.max_atmosphering_speed}`}
                    size="small"
                    variant="outlined"
                  />
                )}
            </Stack>
          }
          secondaryTypographyProps={{ component: 'div' }}
        />
      </ListItem>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={smDown}
      maxWidth="sm"
      aria-labelledby="veh-title"
    >
      <DialogTitle id="veh-title">
        Vehicles & Starships {name ? `• ${name}` : ''}{' '}
        {totalCount ? `(${totalCount})` : ''}
      </DialogTitle>

      <DialogContent dividers>
        {/* Loading placeholder */}
        {(isFetchingVehicles || isFetchingStarships) && (
          <Box>
            {Array.from({ length: 3 }).map((_, i) => (
              <Box key={i} mb={2}>
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            ))}
          </Box>
        )}

        {/* error states */}
        {!isFetchingVehicles && isVehiclesError && (
          <Typography color="error">
            Failed to load vehicles: {String(vehiclesError?.status || '')}{' '}
            {String(vehiclesError?.error || '')}
          </Typography>
        )}
        {!isFetchingStarships && isStarshipsError && (
          <Typography color="error" sx={{ mt: 1 }}>
            Failed to load starships: {String(starshipsError?.status || '')}{' '}
            {String(starshipsError?.error || '')}
          </Typography>
        )}

        {/* empty state */}
        {!isFetchingVehicles && !isFetchingStarships && vCount === 0 && sCount === 0 && (
          <Typography color="text.secondary">
            No vehicles or starships for this person.
          </Typography>
        )}

        {/* results */}
        {(vCount > 0 || sCount > 0) && (
          <List disablePadding>
            {vCount > 0 && (
              <ListSubheader
                component="div"
                disableSticky
                sx={{ px: 0, py: 1, bgcolor: 'transparent' }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Vehicles ({vCount})
                </Typography>
              </ListSubheader>
            )}
            {vehicles.map((v, idx) => (
              <Fragment key={v.url}>
                {renderCraftRow(v, 'vehicle')}
                {idx < vCount - 1 && <Divider component="li" />}
              </Fragment>
            ))}

            {sCount > 0 && (
              <ListSubheader
                component="div"
                disableSticky
                sx={{ px: 0, py: 1.5, bgcolor: 'transparent' }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Starships ({sCount})
                </Typography>
              </ListSubheader>
            )}
            {starships.map((s, idx) => (
              <Fragment key={s.url}>
                {renderCraftRow(s, 'starship')}
                {idx < sCount - 1 && <Divider component="li" />}
              </Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ px: smDown ? 1.5 : 3, py: smDown ? 1 : 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth={smDown}
          disableRipple
          sx={{
            bgcolor: 'primary.main',
            color: 'common.black',
            transition: 'background 0s',
            '&:hover': { bgcolor: 'primary.main' },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
