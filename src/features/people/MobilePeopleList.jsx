import { memo } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Stack,
  Typography,
  Chip,
  Button,
  Divider,
  Box,
} from '@mui/material';
import ImageWithFallback from '../../components/ImageWithFallback.jsx';
import { characterImageFromUrl } from '../../utils/imageUrls.js';
import { formatCm, formatKg, formatEdited } from '../../utils/formatters.js';

/*
 * A single person card used on mobile screens
 * Clicking the card (not the button) opens the details dialog
 */
function PersonCard({ person, onOpenDetails, onOpenVehicles }) {
  const vehicleCount = (person.vehicles?.length || 0) + (person.starships?.length || 0);
  const imgSrc = characterImageFromUrl(person.url);
  const hasCraft = vehicleCount > 0;

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* make the whole card tappable to open details */}
      <CardActionArea onClick={() => onOpenDetails(person)}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <ImageWithFallback
              src={imgSrc}
              alt={person.name}
              label={person.name}
              size={48}
              variant="circular"
            />
            <Box sx={{ minWidth: 0 }}>
              {/* noWrap for long name ellipsis */}
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                {person.name}
              </Typography>

              <Stack direction="row" spacing={0.75} mt={0.5} flexWrap="wrap" useFlexGap>
                <Chip
                  // em dash when gender is n/a
                  label={person.gender && person.gender !== 'n/a' ? person.gender : '—'}
                  size="small"
                  variant="outlined"
                />
                <Chip label={formatCm(person.height)} size="small" variant="outlined" />
                <Chip label={formatKg(person.mass)} size="small" variant="outlined" />
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="caption" color="text.secondary">
            Edited {formatEdited(person.edited)}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
          <Chip
            label={String(vehicleCount)}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 600,
              color: hasCraft ? 'primary.main' : 'text.disabled',
              borderColor: hasCraft ? 'primary.main' : 'divider',
            }}
          />

          <Button
            variant="contained"
            size="small"
            onClick={() => onOpenVehicles(person)}
            disabled={!hasCraft} // disable when there are no vehiclse
            sx={{ ml: 'auto' }}
          >
            Show vehicles
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}


 // renders a vertical stack of PersonCard items
export default memo(function MobilePeopleList({ people, onOpenDetails, onOpenVehicles }) {
  return (
    <Stack spacing={2}>
      {people.map((p) => (
        <PersonCard
          key={p.url}
          person={p}
          onOpenDetails={onOpenDetails}
          onOpenVehicles={onOpenVehicles}
        />
      ))}
    </Stack>
  );
});
