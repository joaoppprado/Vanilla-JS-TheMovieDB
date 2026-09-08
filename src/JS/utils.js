function getReleaseYear(dateString) {
  if (!dateString) return "N/A";

  try {
    const date = new Date(`${dateString}T00:00:00Z`);
    return new Intl.DateTimeFormat(`en-US`, {
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch (error) {
    console.error("Invalid date", dateString);
    return "N/A";
  }
}

function formatRating(rating) {
  if (!rating || rating === 0) return "N/A";
  return Number(rating).toFixed(1);
}

export const UTILS = {
  getReleaseYear,
  formatRating,
};
