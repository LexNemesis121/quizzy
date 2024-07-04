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
import {
	getNextPage,
	getPreviousPage,
	TestNavigation
} from '../components/TestNavigation.tsx';
import { getRandomQuestions } from '../helpers/getRandomQuestions.ts';

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
				questionId={Number(props.qid)}
				questionNumber={Number(props.qid ?? 0)}
				questionTotal={props.quiz.no_of_questions ?? 0}
				changeAnswers={props.changeAnswers}
			/>
			<TestNavigation
				previousPageFn={props.onClick}
				currentPage={props.qid}
				nextPageFn={props.onClick1}
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
			.then((data: { data: Quiz }) => {
				setQuiz(data.data);
				const randomSelectedQuestions = getRandomQuestions(
					data.data.questions,
					data.data.no_of_questions
				);
				const idFilter = randomSelectedQuestions.join(',');
				fetch(`${quizUrlRoot}/quiz_questions?filter[id][_in]=${idFilter}`)
					.then((res) => res.json())
					.then((data: { data: Question[] }) => {
						localStorage.setItem('questions', JSON.stringify(data.data));
						const questions = data.data;
						if (questions) {
							const validAnswers = getValidAnswersList(questions);
							validAnswers && setValidAnswers(validAnswers);
						}
					});
			});
	}, [id]);

	const [qid, setQid] = useState<number | 'finish'>(1);

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

	const calculateScore = (finalAnswers: { [key: string]: number[] }) => {
		let correctAnswersCount = 0;

		if (validAnswers) {
			for (const questionId in finalAnswers) {
				const selectedAnswers = new Set(finalAnswers[questionId]);
				const correctAnswers = new Set(validAnswers[questionId]);

				if (
					selectedAnswers.size === correctAnswers.size &&
					[...selectedAnswers].every((answer) => correctAnswers.has(answer))
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
	}, [answers, finalAnswers, qid]);

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

	if (!quiz || !localStorage.getItem('questions')) return null;
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
								setQid(getNextPage(quiz?.no_of_questions, qid));
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
