export const decimalToTime = (totalMinutes: number): string => {
	const totalSeconds = totalMinutes * 60;
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = Math.round(totalSeconds % 60);
	const hoursStr = hours.toString().padStart(2, '0');
	const minutesStr = minutes.toString().padStart(2, '0');
	const secondsStr = seconds.toString().padStart(2, '0');

	return `${hoursStr}:${minutesStr}:${secondsStr}`;
};

export const secondsToTime = (totalSeconds: number): string => {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = Math.round(totalSeconds % 60);
	const hoursStr = hours.toString().padStart(2, '0');
	const minutesStr = minutes.toString().padStart(2, '0');
	const secondsStr = seconds.toString().padStart(2, '0');

	return `${hoursStr}:${minutesStr}:${secondsStr}`;
};

export const setStartTime = () => {
	const startTime = Date.now();
	localStorage.setItem('startTime', startTime.toString());
	return startTime;
};

export const getStartTime = (): number | null => {
	const startTime = localStorage.getItem('startTime');
	return startTime ? parseInt(startTime, 10) : null;
};

export const setEndTime = (endTime: number) => {
	localStorage.setItem('endTime', endTime.toString());
};

export const getEndTime = (): number | null => {
	const endTime = localStorage.getItem('endTime');
	return endTime ? parseInt(endTime, 10) : null;
};

export const resetTimer = () => {
	localStorage.removeItem('startTime');
	localStorage.removeItem('endTime');
};
