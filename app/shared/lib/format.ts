export const formatTime = (time: string) => time.slice(0, 5);

export const formatSport = (sport: string) =>
  sport.charAt(0) + sport.slice(1).toLowerCase();
