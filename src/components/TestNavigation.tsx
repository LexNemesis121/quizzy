import { Quiz } from '../interfaces/interfaces.ts';

export const getNextPage = (
	lastPage: number,
	currentPage: string | number | undefined
) => {
	const _currentPage = currentPage ? Number(currentPage) : 0;
	if (_currentPage + 1 > lastPage) {
		return 'finish';
	}
	return _currentPage + 1 === lastPage ? lastPage : _currentPage + 1;
};

export const getPreviousPage = (currentPage: string | number | undefined) => {
	const _currentPage = currentPage ? Number(currentPage) : 0;
	return _currentPage - 1 <= 0 ? 1 : _currentPage - 1;
};

const isLastPage = (
	lastPage: number,
	currentPage: string | number | undefined
) => {
	const _currentPage = currentPage ? Number(currentPage) : 0;
	return _currentPage + 1 > lastPage;
};

const isFirstPage = (currentPage: string | number | undefined) => {
	const _currentPage = currentPage ? Number(currentPage) : 0;
	return _currentPage === 0 || _currentPage === 1;
};

export const buttonClass =
	'bg-indigo-600 flex-1 text-white shadow-sm hover:bg-indigo-500 mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
export const buttonClassGreen =
	'bg-green-600 flex-1 text-white shadow-sm hover:bg-green-500 mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
export const disabledButtonClass =
	'bg-gray-200 pointer-events-none cursor-not-allowed flex-1 text-white shadow-sm hover:bg-indigo-500 mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';

export const TestNavigation = (props: {
	currentPage: number;
	previousPageFn: () => void;
	nextPageFn: () => void;
	quiz: Quiz;
}) => {
	return (
		<div className={'w-[600px]'}>
			<div className={'flex flex-row gap-3'}>
				<button
					onClick={props.previousPageFn}
					className={`${isFirstPage(props.currentPage) ? disabledButtonClass : buttonClass}`}
					type='button'
				>
					Previous
				</button>
				<button
					onClick={props.nextPageFn}
					className={`${isLastPage(props.quiz.no_of_questions, props.currentPage) ? disabledButtonClass : buttonClass}`}
				>
					Next
				</button>
			</div>
			<div className='flex'>
				{isLastPage(props.quiz.no_of_questions, props.currentPage) && (
					<button onClick={props.nextPageFn} className={buttonClassGreen}>
						Finish Test
					</button>
				)}
			</div>
		</div>
	);
};
