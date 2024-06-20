import { useState, useEffect, useRef } from 'react';
import { Quiz } from '../interfaces/interfaces.ts';
import { getStartTime, resetTimer, secondsToTime, setEndTime, setStartTime } from '../helpers/dateTime.ts';

const Timer = ({ quiz }: { quiz: Quiz }) => {
	const TOTAL_TEST_TIME = (Number(quiz?.time_per_question ?? 0.5) * (quiz?.questions.length ?? 0)) * 60 * 1000;
	const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TEST_TIME);
	const intervalIdRef = useRef<number | null>(null);

	useEffect(() => {
		const startTime = getStartTime();

		if (startTime) {
			const endTime = startTime + TOTAL_TEST_TIME;

			const updateCountdown = () => {
				const currentTime = Date.now();
				const timeRemaining = endTime - currentTime;
				if (timeRemaining <= 0) {
					setTimeLeft(0);
					if (intervalIdRef.current !== null) {
						clearInterval(intervalIdRef.current);
					}
				} else {
					setTimeLeft(timeRemaining);
				}
			};

			updateCountdown();
			intervalIdRef.current = window.setInterval(updateCountdown, 1000);
			return () => {
				if (intervalIdRef.current !== null) {
					clearInterval(intervalIdRef.current);
				}
			};
		}
	}, [TOTAL_TEST_TIME]);

	const handleStart = () => {
		const startTime = setStartTime();
		const endTime = startTime + TOTAL_TEST_TIME;
		setEndTime(endTime);
		setTimeLeft(TOTAL_TEST_TIME);

		if (intervalIdRef.current !== null) {
			clearInterval(intervalIdRef.current);
		}

		intervalIdRef.current = window.setInterval(() => {
			const currentTime = Date.now();
			const timeRemaining = endTime - currentTime;
			if (timeRemaining <= 0) {
				setTimeLeft(0);
				if (intervalIdRef.current !== null) {
					clearInterval(intervalIdRef.current);
				}
			} else {
				setTimeLeft(timeRemaining);
			}
		}, 1000);
	};

	const handleReset = () => {
		resetTimer();
		setTimeLeft(TOTAL_TEST_TIME);
		if (intervalIdRef.current !== null) {
			clearInterval(intervalIdRef.current);
		}
	};

	return (
		<div>
			<h1>Timer</h1>
			<p>{secondsToTime(Math.floor(timeLeft / 1000))}</p>
			<button onClick={handleStart}>Start Test</button>
			<button onClick={handleReset}>Reset Timer</button>
		</div>
	);
};

export default Timer;
