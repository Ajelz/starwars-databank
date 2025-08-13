import { useEffect, useMemo, useState } from 'react';
import { Avatar } from '@mui/material';

 // if src is empty or the image fails to load we remove the <img> so the avatawr shows the letter initials
export default function ImageWithFallback(props) {
  const {
    src,
    alt,
    label, // name used for the fallback initial
    size = 32,
    variant = 'circular',
    sx,
    kind,
    ...rest
  } = props;

  const [failed, setFailed] = useState(false);
  const [current, setCurrent] = useState(src || '');

  useEffect(() => {
    setCurrent(src || '');
    setFailed(false);
  }, [src]);

  const letter = useMemo(() => {
    const s = (label || alt || '').trim();
    return s ? s[0].toUpperCase() : '?';
  }, [label, alt]);

  // If no src or load failed do not render an img because avatar will show initials letter
  const effectiveSrc = current && !failed ? current : undefined;

  return (
    <Avatar
      src={effectiveSrc}
      alt={alt}
      variant={variant}
      sx={{ width: size, height: size, ...sx }}
      imgProps={{
        onError: () => setFailed(true),
        loading: 'lazy',
      }}
      {...rest}
    >
      {letter}
    </Avatar>
  );
}
