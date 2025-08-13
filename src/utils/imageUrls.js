import { extractId } from './extractId.js';
import {
  characterImageMap,
  vehicleImageMap,
  starshipImageMap,
} from '../data/imageMap.js';

// return the mapped img url from imageMap.js, if not mapped return '' to fallback to initials
export function characterImageFromUrl(personUrl) {
  const id = extractId(personUrl, 'people');
  if (!id) return '';
  const mapped = characterImageMap[id];
  return typeof mapped === 'string' && mapped.trim() ? mapped.trim() : '';
}

export function vehicleImageFromUrl(vehicleUrl) {
  const id = extractId(vehicleUrl, 'vehicles');
  if (!id) return '';
  const mapped = vehicleImageMap[id];
  return typeof mapped === 'string' && mapped.trim() ? mapped.trim() : '';
}

export function starshipImageFromUrl(starshipUrl) {
  const id = extractId(starshipUrl, 'starships');
  if (!id) return '';
  const mapped = starshipImageMap[id];
  return typeof mapped === 'string' && mapped.trim() ? mapped.trim() : '';
}
