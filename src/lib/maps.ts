export function buildGoogleMapsSearchUrl(input: {
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
}): string | null {
  const { latitude, longitude, address } = input;

  if (latitude != null && longitude != null) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }

  const trimmed = address?.trim();
  if (trimmed) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
  }

  return null;
}

export function buildGoogleMapsDirectionsUrl(input: {
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
}): string | null {
  const { latitude, longitude, address } = input;

  if (latitude != null && longitude != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  }

  const trimmed = address?.trim();
  if (trimmed) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(trimmed)}`;
  }

  return null;
}
