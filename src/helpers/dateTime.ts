export const formatDuration = (milliseconds: number): string => {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const pad = (num: number) => String(num).padStart(2, '0');

	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

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
	let startTime = localStorage.getItem('startTime');
	if (!startTime) {
		startTime = Date.now().toString();
		localStorage.setItem('startTime', startTime);
		localStorage.setItem('time_started', startTime);
	}
	return parseInt(startTime, 10);
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

export const checkAndResetTimer = () => {
	const endTime = getEndTime();
	if (endTime !== null && Date.now() > endTime) {
		resetTimer();
	}
};
