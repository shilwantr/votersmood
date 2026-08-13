// Helper to format counts:
// < 1000 => exact number (e.g. 999)
// >= 1000 && < 1,000,000 => 1.4k, 1.8k, 15.4k
// >= 1,000,000 => 1.2mn, 5mn
export const formatCompactNumber = (num) => {
  const count = Number(num) || 0;
  if (count < 1000) {
    return count.toString();
  }
  if (count < 1000000) {
    const kVal = (count / 1000).toFixed(1).replace(/\.0$/, '');
    return `${kVal}k`;
  }
  const mVal = (count / 1000000).toFixed(1).replace(/\.0$/, '');
  return `${mVal}mn`;
};
