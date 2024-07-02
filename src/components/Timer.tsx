import { useEffect, useRef, useState } from 'react';
import { Quiz } from '../interfaces/interfaces.ts';
import {
	getStartTime,
	resetTimer,
	secondsToTime,
	setEndTime,
	setStartTime
} from '../helpers/dateTime.ts';
import timerService from '../services/timer.service.ts';

const Timer = ({ quiz, endTest }: { quiz: Quiz; endTest: () => void }) => {
	const TOTAL_TEST_TIME =
		Number(quiz?.time_per_question ?? 0.5) *
		(quiz?.questions.length ?? 0) *
		60 *
		1000;

	const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TEST_TIME);
	const intervalIdRef = useRef<number | null>(null);

	// useEffect(() => {
	// 	if (timeLeft < 1000) {
	// 		// endTest();
	// 		handleReset();
	// 	}
	// }, [timeLeft]);

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

	useEffect(() => {
		const subscription = timerService.timeState().subscribe((flowing) => {
			if (flowing) {
				handleStart();
			} else {
				handleReset();
			}

			const startTime = getStartTime();
			if (startTime) {
				handleStart();
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [TOTAL_TEST_TIME]);

	const handleStart = () => {
		const startTime = setStartTime();
		const endTime = startTime + TOTAL_TEST_TIME;
		setEndTime(endTime);
		setTimeLeft(endTime - Date.now());

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

	const calculateProgress = () => {
		return ((TOTAL_TEST_TIME - timeLeft) / TOTAL_TEST_TIME) * 100;
	};

	return (
		<div className='overflow-hidden p-5 rounded-lg bg-white shadow min-w-[600px] mb-4'>
			<div className={'flex flex-row justify-between w-full'}>
				<div>Time left:</div>
				<div>{secondsToTime(Math.floor(timeLeft / 1000))}</div>
			</div>
			<div className='w-full bg-slate-200 rounded-full h-1.5 mb-4 mt-2'>
				<div
					className='bg-indigo-500 h-1.5 rounded-full'
					style={{ width: `${calculateProgress()}%` }}
				/>
			</div>
		</div>
	);
};

export default Timer;
