import { Question, Quiz } from '../interfaces/interfaces.ts';
import { useNavigate } from 'react-router-dom';
import {
	decimalToTime,
	formatDuration,
	resetTimer
} from '../helpers/dateTime.ts';
import { buttonClass } from './Test.page.tsx';
import { useEffect, useRef, useState } from 'react';
import { quizUrlRoot } from '../helpers/appUrls.ts';
import { TestCardPreview } from '../components/TestCardPreview.tsx';
import { getValidAnswersList } from '../helpers/validAnswers.ts';

export const TestResults = (props: {
	correctAnswersCount: number;
	quiz: Quiz;
}) => {
	const alreadySaved = useRef(false);

	const navigate = useNavigate();

	const [validAnswers, setValidAnswers] = useState<{ [key: string]: number[] }>(
		{}
	);

	const [questions, setQuestions] = useState<Question[]>([]);
	const [selectedAnswers, setSelectedAnswers] = useState<{
		[key: string]: number[];
	}>();

	// Fetch questions and valid answers
	useEffect(() => {
		fetch(`${quizUrlRoot}/quiz_questions`)
			.then((res) => res.json())
			.then((data: { data: Question[] }) => {
				setQuestions(data.data);
				setValidAnswers(getValidAnswersList(data));
			});
	}, []);

	// Fetch selected answers
	useEffect(() => {
		const storedAnswers = localStorage.getItem('answers');
		if (storedAnswers) {
			const parsedAnswers = JSON.parse(storedAnswers);
			setSelectedAnswers(parsedAnswers ?? []);
		}
		localStorage.removeItem('answers');
	}, []);

	// Create the result object and store it in localStorage
	useEffect(() => {
		if (questions.length && validAnswers) {
			const result = questions.map((question) => {
				const selected = selectedAnswers?.[question.id] || [];
				const valid = validAnswers[question.id] || [];
				const score =
					selected.every((ans) => valid.includes(ans)) &&
					selected.length === valid.length
						? 1
						: 0;
				return {
					question: question.question,
					answers: question.answers,
					selectedAnswers: selected,
					validAnswers: valid,
					score: score
				};
			});

			const totalScore = result.reduce((acc, item) => acc + item.score, 0);

			const testTaker = localStorage.getItem('test_taker') || 'unknown';
			const startTime = parseInt(
				localStorage.getItem('time_started') || '0',
				10
			);
			const endTime = parseInt(localStorage.getItem('time_ended') || '0', 10);
			const duration = endTime - startTime;

			const resultObject = {
				user_name: testTaker,
				quiz_id: props.quiz.id,
				questions: result,
				passed:
					(props.correctAnswersCount / props.quiz.questions.length) * 100 >=
					props.quiz.pass_mark,
				percentage:
					(props.correctAnswersCount / props.quiz.questions.length) * 100,
				points: totalScore,
				total_questions: questions.length,
				duration: formatDuration(duration),
				date: new Date().toISOString()
			};

			if (!alreadySaved.current) {
				fetch('https://cms.gameroom.ro/items/quiz_results', {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'POST',
					body: JSON.stringify(resultObject)
				});
				alreadySaved.current = true;
			}

			resetTimer();
		}
	}, [questions, selectedAnswers, validAnswers, props.quiz.id]);

	useEffect(() => {
		document.addEventListener('contextmenu', (event) => {
			event.preventDefault();
		});
	}, []);

	return (
		<div className='mx-auto w-[600px]'>
			<div>
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
								{(
									(props.correctAnswersCount / props.quiz.questions.length) *
									100
								).toFixed(2)}{' '}
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
			<div className={'mt-5 flex flex-col gap-5'}>
				{questions.map((question) => {
					return (
						<TestCardPreview
							key={question.id}
							selectedAnswers={selectedAnswers?.[question.id]}
							validAnswers={validAnswers?.[question.id]}
							questionId={question.id}
							questionNumber={Number(question.id ?? 1)}
							questionTotal={props.quiz.questions?.length ?? 0}
						/>
					);
				})}
			</div>
			<button
				onClick={() => {
					navigate('/');
				}}
				className={buttonClass + ' mb-5 w-full'}
				type='button'
			>
				Go back to Homepage
			</button>
		</div>
	);
};
