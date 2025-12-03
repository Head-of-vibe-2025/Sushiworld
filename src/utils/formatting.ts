// Formatting Utilities

export const formatPrice = (price: number, currency: string = '€'): string => {
  return `${currency}${price.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPoints = (points: number): string => {
  return points.toLocaleString('en-US');
};

export const pointsToEuros = (points: number): number => {
  return points / 100; // 100 points = €1
};

export const eurosToPoints = (euros: number): number => {
  // Multiply by 100 and round to handle floating point precision issues
  // Then floor to ensure we don't round up (as per business logic)
  const points = Math.round(euros * 100);
  return Math.floor(points); // €1 = 100 points
};

