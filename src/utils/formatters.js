import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const formatCm = (v) => (v && v !== 'unknown' ? `${v} cm` : '—');
export const formatKg = (v) => (v && v !== 'unknown' ? `${v} kg` : '—');
export const formatEdited = (iso) =>
  iso ? `${dayjs(iso).fromNow()} (${dayjs(iso).format('YYYY-MM-DD')})` : '—';
