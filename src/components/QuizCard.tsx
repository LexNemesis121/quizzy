import timerService from '../services/timer.service.ts';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getStartTime, setEndTime, setStartTime } from '../helpers/dateTime.ts';

export const QuizCard = ({
	title,
	children,
	buttonUrl,
	buttonLabel,
	testTime
}: {
	title: string;
	buttonUrl: string;
	buttonLabel: string;
	children: React.ReactNode;
	testTime: number;
}) => {
	const startTest = () => {
		timerService.startTimer();
		setStartTime();
		setEndTime(getStartTime() ?? Date.now() + testTime);
	};

	const [validCode, setValidCode] = useState<boolean>(false);
	const [typedCode, setTypedCode] = useState<string>('');

	const users = {
		gnLOGBImZI: 'Alin Dumitru',
		YQQsCtjqkS: 'Claudiu Tucmeanu',
		haXjoRCOGe: 'Sonia Banea',
		MzuxtaPAAO: 'Mihai Balan',
		mvFysANAos: 'Alexandru Crihan',
		RlxWCZvaxD: 'Alexandru Verdes',
		cTstPsbAnD: 'Demo/Test Account'
	};

	useEffect(() => {
		if (validCode) {
			localStorage.removeItem('test_taker');
			users[typedCode as keyof typeof users] &&
				localStorage.setItem(
					'test_taker',
					users[typedCode as keyof typeof users]
				);
		}
	}, [typedCode, validCode]);

	const isCodeValid = (code: string) => {
		return Object.keys(users).indexOf(code) !== -1;
	};

	const navigate = useNavigate();

	return (
		<div className='divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow'>
			<div className='px-4 py-5 sm:px-6'>
				<h3 className={'text-lg font-semibold leading-8 text-indigo-600'}>
					{title}
				</h3>
			</div>
			<div className='px-4 py-5 sm:p-6'>{children}</div>
			<div className='px-4 py-5 sm:px-6'>
				{buttonLabel === 'Take Test' && (
					<div className={'text-sm leading-6 text-indigo-600'}>
						You will need to enter the code you received to start this test
					</div>
				)}
				{buttonLabel === 'Take Test' && (
					<div className='mt-5'>
						<label
							htmlFor='code'
							className='block text-sm font-medium leading-6 text-gray-900'
						>
							Code
						</label>
						<div className='mt-2'>
							<input
								type='text'
								name='code'
								id='code'
								onChange={(e) => {
									setValidCode(isCodeValid(e.target.value));
									setTypedCode(e.target.value);
								}}
								className='block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
								placeholder='you@example.com'
							/>
						</div>
					</div>
				)}
				{(validCode || buttonLabel !== 'Take Test') && (
					<button
						type='button'
						onClick={() => {
							if (buttonLabel === 'Take Test') {
								startTest();
								setTimeout(() => {
									navigate(buttonUrl);
								}, 100);
							}
						}}
						className={
							'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
						}
					>
						{buttonLabel}
					</button>
				)}
			</div>
		</div>
	);
};
