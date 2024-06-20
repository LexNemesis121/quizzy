export const decimalToTime = (totalMinutes: number): string => {
	// Convert minutes to seconds
	const totalSeconds = totalMinutes * 60;
	// Calculate the number of hours, minutes, and seconds
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = Math.round(totalSeconds % 60);

	// Format hours, minutes, and seconds with leading zeros if needed
	const hoursStr = hours.toString().padStart(2, '0');
	const minutesStr = minutes.toString().padStart(2, '0');
	const secondsStr = seconds.toString().padStart(2, '0');

	// Return the time in HH:MM:SS format
	return `${hoursStr}:${minutesStr}:${secondsStr}`;
};
