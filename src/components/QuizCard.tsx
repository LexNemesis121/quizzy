import timerService from '../services/timer.service.ts';
import { NavLink } from 'react-router-dom';

export const QuizCard = ({
	title,
	children,
	buttonUrl,
	buttonLabel
}: {
	title: string;
	buttonUrl: string;
	buttonLabel: string;
	children: React.ReactNode;
}) => {
	const startTest = () => {
		timerService.startTimer();
	};

	return (
		<div className='divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow'>
			<div className='px-4 py-5 sm:px-6'>
				<h3 className={'text-lg font-semibold leading-8 text-indigo-600'}>
					{title}
				</h3>
			</div>
			<div className='px-4 py-5 sm:p-6'>
				{children}
				<NavLink
					to={buttonUrl}
					onClick={startTest}
					className={
						'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
					}
				>
					{buttonLabel}
				</NavLink>
			</div>
		</div>
	);
};
