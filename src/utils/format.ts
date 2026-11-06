const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

const DAY_MS = 86400000;

/** 12 MAR 2026 */
export function formatDate(ts: number): string {
  const d = new Date(ts);
  const day = d.getDate() < 10 ? '0' + d.getDate() : String(d.getDate());
  return day + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}

/** 3 420 — thin thousands separator that always renders on Android. */
export function groupNumber(n: number): string {
  const s = Math.round(n).toString();
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) {
      out += ' ';
    }
    out += s[i];
  }
  return out;
}

/** "2 YEARS AGO" / "7 MONTHS AGO" / "21 DAYS AGO" */
export function ageLabel(ts: number, now: number = Date.now()): string {
  const days = Math.max(1, Math.floor((now - ts) / DAY_MS));
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return years + (years === 1 ? ' YEAR AGO' : ' YEARS AGO');
  }
  if (days >= 30) {
    const months = Math.floor(days / 30);
    return months + (months === 1 ? ' MONTH AGO' : ' MONTHS AGO');
  }
  return days + (days === 1 ? ' DAY AGO' : ' DAYS AGO');
}

export function percent(part: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round((part / total) * 100)));
}

export function pagesPerMinute(pages: number, minutes: number): string {
  if (minutes <= 0) {
    return '0.0';
  }
  return (pages / minutes).toFixed(1);
}

export function daysAgo(n: number): number {
  return Date.now() - n * DAY_MS;
}
