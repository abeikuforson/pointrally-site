export function formatPoints(points: number): string {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M`;
  }
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}K`;
  }
  return points.toLocaleString();
}

export function formatTeamName(teamCode: string): string {
  const teamNames: Record<string, string> = {
    LAL: 'Los Angeles Lakers',
    LAD: 'Los Angeles Dodgers',
    LAR: 'Los Angeles Rams',
    LAC: 'Los Angeles Clippers',
    LAFC: 'Los Angeles FC',
    LAG: 'LA Galaxy',
    LAK: 'Los Angeles Kings',
    ANA: 'Anaheim Ducks',
    GSW: 'Golden State Warriors',
    SF: 'San Francisco Giants',
    SF49: 'San Francisco 49ers',
    OAK: 'Oakland Athletics',
    SJ: 'San Jose Sharks',
    SAC: 'Sacramento Kings',
    SD: 'San Diego Padres',
    PHX: 'Phoenix Suns',
    ARI: 'Arizona Cardinals',
    ARZ: 'Arizona Diamondbacks',
    VGK: 'Vegas Golden Knights',
    LVR: 'Las Vegas Raiders'
  };

  return teamNames[teamCode] || teamCode;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
}

export function formatCreditCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ');
}

export function maskCreditCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return cardNumber;
  return `•••• •••• •••• ${cleaned.slice(-4)}`;
}

export function formatExpiryDate(date: string): string {
  const cleaned = date.replace(/\D/g, '');

  if (cleaned.length >= 2) {
    const month = cleaned.slice(0, 2);
    const year = cleaned.slice(2, 4);
    return year ? `${month}/${year}` : month;
  }

  return cleaned;
}

export function formatAddress(address: {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}): string {
  const parts = [
    address.street1,
    address.street2,
    `${address.city}, ${address.state} ${address.zip}`,
    address.country
  ].filter(Boolean);

  return parts.join(', ');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export function formatPercentage(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(startDate);

  const end = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(endDate);

  if (startDate.getFullYear() === endDate.getFullYear()) {
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
        startDate
      )} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
    }
  }

  return `${start} - ${end}`;
}

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return '1 year ago';

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return '1 month ago';

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return '1 day ago';

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  if (interval === 1) return '1 hour ago';

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  if (interval === 1) return '1 minute ago';

  return 'just now';
}

export function formatCompactNumber(num: number): string {
  const formatter = new Intl.NumberFormat('en', {
    notation: 'compact',
    compactDisplay: 'short'
  });
  return formatter.format(num);
}

export function formatList(items: string[], conjunction = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(` ${conjunction} `);

  return `${items.slice(0, -1).join(', ')}, ${conjunction} ${items[items.length - 1]}`;
}