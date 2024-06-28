import { TestCard } from '../components/TestCard.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { quizUrlRoot } from '../helpers/appUrls.ts';
import { Question, Quiz } from '../interfaces/interfaces.ts';
import Timer from '../components/Timer.tsx';
import { decimalToTime } from '../helpers/dateTime.ts';

const getNextPage = (
	lastPage: number,
	currentPage: string | number | undefined
) => {
	const _currentPage = currentPage ? Number(currentPage) : 0;
	if (_currentPage + 1 > lastPage) {
		return 'finish';
	}
	return _currentPage + 1 === lastPage
		? lastPage
		: (_currentPage === 0 ? 1 : _currentPage) + 1;
};

const getPreviousPage = (currentPage: string | number | undefined) => {
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

function TestNavigation(props: {
	onClick: () => void;
	currentPage: number;
	onClick1: () => void;
	quiz: Quiz;
}) {
	return (
		<div className={'w-[600px]'}>
			<div className={'flex flex-row gap-3'}>
				<button
					onClick={props.onClick}
					className={`${isFirstPage(props.currentPage) ? disabledButtonClass : buttonClass}`}
					type='button'
				>
					Previous
				</button>
				<button
					onClick={props.onClick1}
					className={`${isLastPage(props.quiz.questions.length, props.currentPage) ? disabledButtonClass : buttonClass}`}
				>
					Next
				</button>
			</div>
			<div className='flex'>
				{isLastPage(props.quiz.questions.length, props.currentPage) && (
					<button onClick={props.onClick1} className={buttonClassGreen}>
						Finish Test
					</button>
				)}
			</div>
		</div>
	);
}

const TestResults = (props: { correctAnswersCount: number; quiz: Quiz }) => {
	const navigate = useNavigate();

	return (
		<div>
			<div className='mx-auto max-w-3xl'>
				<div className='container'></div>
				<div className='divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow'>
					<div className='px-4 py-5 sm:px-6'>
						<h3
							className={
								'text-sm flex flex-row items-center font-semibold text-gray-700'
							}
						>
							Test Results:{' '}
							<span className={'pl-2'}>
								{(props.correctAnswersCount / props.quiz.questions.length) *
									100 <
								props.quiz.pass_mark ? (
									<span className='inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10'>
										Failed
									</span>
								) : (
									<span className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
										Passed
									</span>
								)}
							</span>
						</h3>
					</div>
					<div className={'p-6'}>
						<div className={'text-sm leading-6 text-gray-600'}>
							Points:{' '}
							<span className={'text-sm font-bold text-gray-900'}>
								{props.correctAnswersCount} / {props.quiz.questions.length}
							</span>
						</div>
						<div className={'text-sm leading-6 text-gray-600'}>
							Percentage:{' '}
							<span className={'text-sm font-bold text-gray-900'}>
								{(props.correctAnswersCount / props.quiz.questions.length) *
									100}{' '}
								%
							</span>
						</div>
						<div className={'text-sm leading-6 text-gray-600'}>
							Duration of test:{' '}
							<span className={'text-sm font-bold text-gray-900'}>
								{decimalToTime(
									(props.quiz.questions?.length ?? 0) *
										Number(props.quiz.time_per_question)
								)}
							</span>
						</div>
					</div>
				</div>
			</div>
			<button
				onClick={() => {
					navigate('/');
				}}
				className={buttonClass}
				type='button'
			>
				Go back to Homepage
			</button>
		</div>
	);
};

const Test = (props: {
	quiz: Quiz;
	qid: number;
	changeAnswers: (answer: { [p: string]: [number] }) => void;
	onClick: () => void;
	onClick1: () => void;
}) => {
	return (
		<>
			<Timer quiz={props.quiz} />
			<TestCard
				questionId={Number(props.qid === 0 ? 1 : props.qid)}
				questionNumber={Number(props.qid ?? 1)}
				questionTotal={props.quiz.questions?.length ?? 0}
				changeAnswers={props.changeAnswers}
			/>
			<TestNavigation
				onClick={props.onClick}
				currentPage={props.qid}
				onClick1={props.onClick1}
				quiz={props.quiz}
			/>
		</>
	);
};

export const TestPage = () => {
	const { id } = useParams();
	const [quiz, setQuiz] = useState<Quiz | undefined>(undefined);

	useEffect(() => {
		fetch(`${quizUrlRoot}/quiz/${id}`)
			.then((res) => res.json())
			.then((data: { data: Quiz }) => setQuiz(data.data));
	}, [id]);

	const [qid, setQid] = useState<number | 'finish'>(0);

	const [answers, setAnswers] = useState<{ [key: string]: [number] }>();
	const [finalAnswers, setFinalAnswers] = useState<{
		[key: string]: [number];
	}>();
	const [validAnswers, setValidAnswers] = useState<{ [key: string]: number }>();
	const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

	useEffect(() => {
		fetch(`${quizUrlRoot}/quiz_questions`)
			.then((res) => res.json())
			.then((data: { data: Question[] }) => {
				const validAnswers = data.data.reduce(
					(acc: { [key: string]: number }, question, index) => {
						acc[(index + 1).toString()] = question.answers.findIndex(
							(answer) => answer.is_valid
						);
						return acc;
					},
					{}
				);
				setValidAnswers(validAnswers);
			});
	}, []);

	useEffect(() => {
		console.log(validAnswers);
	}, [validAnswers]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const calculateScore = (finalAnswers: { [key: string]: [number] }) => {
		let correctAnswersCount = 0;

		if (validAnswers) {
			for (const questionId in finalAnswers) {
				if (finalAnswers[questionId][0] === validAnswers[questionId]) {
					correctAnswersCount++;
				}
			}
		}

		setCorrectAnswersCount(correctAnswersCount);
	};

	useEffect(() => {
		if (qid === 'finish') {
			setFinalAnswers(answers);
			answers && calculateScore(answers);
		}
	}, [answers, calculateScore, finalAnswers, qid]);

	const changeAnswers = (answer: { [key: string]: [number] }) => {
		setAnswers({ ...answers, ...answer });
	};

	if (!quiz) return null;
	return (
		<>
			<div className='mx-auto w-[600px] px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto'>
					<div className='container'>
						<h1 className='text-lg mb-5 font-bold tracking-tight text-gray-900 sm:text-lg'>
							{quiz.quiz_name}
						</h1>
					</div>
					{qid === 'finish' ? (
						<TestResults
							correctAnswersCount={correctAnswersCount}
							quiz={quiz}
						/>
					) : (
						<Test
							quiz={quiz}
							qid={qid}
							changeAnswers={changeAnswers}
							onClick={() => {
								setQid(getPreviousPage(qid));
							}}
							onClick1={() => {
								setQid(getNextPage(quiz.questions.length, qid));
							}}
						/>
					)}
				</div>
			</div>
		</>
	);
};
