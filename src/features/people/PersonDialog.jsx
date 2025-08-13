import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { characterImageFromUrl } from '../../utils/imageUrls.js';
import { useGetManyByUrlsQuery } from '../../services/swapiApi.js';

 // Fixed-size container, centers the image, border lives on the image with letter fallback
function CharacterPhoto({ src, alt, width = 240, maxHeight = 300 }) {
  const [error, setError] = useState(false);
  const letter = (alt || '').trim().charAt(0).toUpperCase() || '?';

  // Placeholder to keep same dimension witha frame
  if (!src || error) {
    return (
      <Box
        aria-label={`${alt} photo placeholder`}
        sx={{
          width,
          height: maxHeight,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50',
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        {letter}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width,
        height: maxHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        onError={() => setError(true)}
        sx={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      />
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.6 }}>
        {title}
      </Typography>
      <Box mt={1}>{children}</Box>
    </Box>
  );
}

const pretty = (v) => (v && v !== 'unknown' ? v : '—');

export default function PersonDialog({ open, onClose, person }) {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const src = person ? characterImageFromUrl(person.url) : '';
  const name = person?.name || '';

  // Build url groups
  const homeworldUrls = person?.homeworld ? [person.homeworld] : [];
  const speciesUrls = person?.species || [];
  const filmUrls = person?.films || [];
  const vehicleUrls = person?.vehicles || [];
  const starshipUrls = person?.starships || [];

  // fetch the related resources (skip if dialog closed)
  const { data: [homeworld] = [], isFetching: isHw } = useGetManyByUrlsQuery(
    homeworldUrls,
    { skip: !open }
  );
  const { data: species = [], isFetching: isSp } = useGetManyByUrlsQuery(speciesUrls, {
    skip: !open,
  });
  const { data: films = [], isFetching: isFl } = useGetManyByUrlsQuery(filmUrls, {
    skip: !open,
  });
  const { data: vehicles = [], isFetching: isVe } = useGetManyByUrlsQuery(vehicleUrls, {
    skip: !open,
  });
  const { data: starships = [], isFetching: isSt } = useGetManyByUrlsQuery(starshipUrls, {
    skip: !open,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={smDown}
      maxWidth="md"
      aria-labelledby="person-title"
    >
      <DialogTitle id="person-title">{name}</DialogTitle>
      <DialogContent dividers>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Photo */}
          <CharacterPhoto
            src={src}
            alt={name}
            width={smDown ? 300 : 260}
            maxHeight={smDown ? 360 : 320}
          />

          {/* Details */}
          <Stack spacing={3} flex={1} minWidth={0}>
            {/* Basics */}
            <Section title="Basics">
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={`Gender: ${pretty(person?.gender)}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Birth year: ${pretty(person?.birth_year)}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Height: ${pretty(person?.height)}${person?.height && person.height !== 'unknown' ? ' cm' : ''}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Mass: ${pretty(person?.mass)}${person?.mass && person.mass !== 'unknown' ? ' kg' : ''}`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Section>

            {/* Appearance */}
            <Section title="Appearance">
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={`Hair: ${pretty(person?.hair_color)}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Eyes: ${pretty(person?.eye_color)}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Skin: ${pretty(person?.skin_color)}`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Section>

            {/* origin or species */}
            <Section title="Origin">
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={`Homeworld: ${isHw ? '…' : homeworld?.name || '—'}`}
                  size="small"
                  variant="outlined"
                />
                {(isSp ? ['…'] : species.length ? species.map((s) => s.name) : ['Human'])
                  .filter(Boolean)
                  .map((label) => (
                    <Chip
                      key={label}
                      label={`Species: ${label}`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
              </Stack>
            </Section>

            <Divider />

            {/* films */}
            <Section title="Films">
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(isFl ? [] : films)
                  .slice()
                  .sort((a, b) => a.episode_id - b.episode_id)
                  .map((f) => (
                    <Chip
                      key={f.url}
                      label={`Ep ${f.episode_id}: ${f.title} (${dayjs(f.release_date).year() || ''})`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                {!isFl && films.length === 0 && (
                  <Typography color="text.secondary">—</Typography>
                )}
              </Stack>
            </Section>

            {/* vehicles */}
            <Section title="Vehicles & Starships">
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(isVe ? [] : vehicles).map((v) => (
                  <Chip
                    key={v.url}
                    label={`Vehicle: ${v.name}`}
                    size="small"
                    variant="outlined"
                  />
                ))}
                {(isSt ? [] : starships).map((s) => (
                  <Chip
                    key={s.url}
                    label={`Starship: ${s.name}`}
                    size="small"
                    variant="outlined"
                  />
                ))}
                {!isVe && !isSt && vehicles.length === 0 && starships.length === 0 && (
                  <Typography color="text.secondary">—</Typography>
                )}
              </Stack>
            </Section>
          </Stack>
        </Stack>
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
            '&:hover': { bgcolor: 'primary.main' }, // locked hover to avoid MUI's black-flash
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
