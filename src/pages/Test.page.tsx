import { TestCard } from '../components/TestCard.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { quizUrlRoot } from '../helpers/appUrls.ts';
import { Question, Quiz } from '../interfaces/interfaces.ts';
import Timer from '../components/Timer.tsx';
import { checkTimer, getEndTime, resetTimer } from '../helpers/dateTime.ts';
import { TestResults } from './TestResults.page.tsx';
import { getValidAnswersList } from '../helpers/validAnswers.ts';
import { userImg } from '../helpers/userImg.ts';
import { questionListImg } from '../helpers/questionListImg.ts';

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

const Test = (props: {
	quiz: Quiz;
	qid: number;
	changeAnswers: (answer: { [key: string]: number[] }) => void;
	onClick: () => void;
	onClick1: () => void;
	endTest: () => void;
}) => {
	useEffect(() => {
		document.addEventListener('contextmenu', (event) => {
			event.preventDefault();
		});
	}, []);

	return (
		<>
			<Timer
				quiz={props.quiz}
				endTest={() => {
					props.endTest();
				}}
			/>
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

	const [answers, setAnswers] = useState<{ [key: string]: number[] }>({});
	useEffect(() => {
		const storedAnswers = localStorage.getItem('answers');
		if (storedAnswers) {
			setAnswers(JSON.parse(storedAnswers));
		}
	}, []);

	const [finalAnswers, setFinalAnswers] = useState<{
		[key: string]: number[];
	}>({});
	const [validAnswers, setValidAnswers] = useState<{ [key: string]: number[] }>(
		{}
	);
	const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

	useEffect(() => {
		fetch(`${quizUrlRoot}/quiz_questions`)
			.then((res) => res.json())
			.then((data: { data: Question[] }) => {
				const validAnswers = getValidAnswersList(data);
				setValidAnswers(validAnswers);
			});
	}, []);

	const calculateScore = (finalAnswers: { [key: string]: number[] }) => {
		let correctAnswersCount = 0;

		if (validAnswers) {
			for (const questionId in finalAnswers) {
				const selectedAnswers = finalAnswers[questionId].sort();
				const correctAnswers = validAnswers[questionId].sort();

				if (
					JSON.stringify(selectedAnswers) === JSON.stringify(correctAnswers)
				) {
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
			localStorage.setItem('time_ended', JSON.stringify(Date.now()));
			resetTimer();
		}
	}, [answers, calculateScore, finalAnswers, qid]);

	const changeAnswers = (answer: { [key: string]: number[] }) => {
		const updatedAnswers = { ...answers, ...answer };
		setAnswers(updatedAnswers);
		localStorage.setItem('answers', JSON.stringify(updatedAnswers));
	};

	const navigate = useNavigate();

	useEffect(() => {
		if (checkTimer() || getEndTime() === null) {
			navigate(`/${id}`);
		}
	}, [id]);

	if (!quiz) return null;
	return (
		<>
			<div className='mx-auto w-[600px] px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto'>
					<div className='container'>
						<h1 className='text-lg mb-5 font-bold tracking-tight text-gray-900 sm:text-lg'>
							{quiz.quiz_name}
						</h1>
						<div className='flex flex-row gap-5 divide-x divide-gray-400 mb-5'>
							<div className={'flex flex-row items-center gap-2'}>
								<img className={'w-5 h-5'} src={questionListImg} />
								<span>Question List</span>
							</div>
							<div className={'flex flex-row items-center pl-5 gap-2'}>
								<img className={'w-5 h-5'} src={userImg} />
								<span>{localStorage.getItem('test_taker')}</span>
							</div>
						</div>
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
							endTest={() => {
								setQid('finish');
							}}
						/>
					)}
				</div>
			</div>
		</>
	);
};
