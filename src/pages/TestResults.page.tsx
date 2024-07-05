import { Question, Quiz } from '../interfaces/interfaces.ts';
import { useNavigate } from 'react-router-dom';
import { formatDuration, resetTimer } from '../helpers/dateTime.ts';
import { useEffect, useRef, useState } from 'react';
import { TestCardPreview } from '../components/TestCardPreview.tsx';
import { getValidAnswersList } from '../helpers/validAnswers.ts';
import { buttonClass } from '../components/TestNavigation.tsx';

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
		const questions = JSON.parse(localStorage.getItem('questions') as string);
		setQuestions(questions);
		setValidAnswers(getValidAnswersList(questions));
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

	const [duration, setDuration] = useState<string>();

	// Create the result object and store it in localStorage
	useEffect(() => {
		if (questions.length && validAnswers && selectedAnswers) {
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

			// const totalScore = result.reduce((acc, item) => acc + item.score, 0);

			const totalScore = props.correctAnswersCount;

			const testTaker = localStorage.getItem('test_taker') || 'unknown';
			const startTime = parseInt(
				localStorage.getItem('time_started') || '0',
				10
			);
			const endTime = parseInt(localStorage.getItem('time_ended') || '0', 10);
			const duration = endTime - startTime;
			const formattedDuration = formatDuration(duration);
			setDuration(formattedDuration);

			const resultObject = {
				user_name: testTaker,
				quiz_id: props.quiz.id,
				questions: result,
				passed:
					(props.correctAnswersCount / props.quiz.no_of_questions) * 100 >=
					props.quiz.pass_mark,
				percentage:
					(props.correctAnswersCount / props.quiz.no_of_questions) * 100,
				points: totalScore,
				total_questions: props.quiz.no_of_questions,
				duration: formattedDuration,
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
								{(props.correctAnswersCount / props.quiz.no_of_questions) *
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
								{props.correctAnswersCount} / {props.quiz.no_of_questions}
							</span>
						</div>
						<div className={'text-sm leading-6 text-gray-600'}>
							Percentage:{' '}
							<span className={'text-sm font-bold text-gray-900'}>
								{(
									(props.correctAnswersCount / props.quiz.no_of_questions) *
									100
								).toFixed(2)}{' '}
								%
							</span>
						</div>
						<div className={'text-sm leading-6 text-gray-600'}>
							Duration of test:{' '}
							<span className={'text-sm font-bold text-gray-900'}>
								{duration}
							</span>
						</div>
					</div>
				</div>
			</div>
			{Object.keys(selectedAnswers ?? {}).length > 0 ? (
				<div className={'mt-5 flex flex-col gap-5'}>
					{questions
						.slice(0, props.quiz.no_of_questions)
						.map((question, index) => {
							return (
								<TestCardPreview
									key={question.id}
									selectedAnswers={selectedAnswers?.[index]}
									validAnswers={validAnswers?.[index]}
									questionId={question.id}
									questionIndex={index}
									questionTotal={props.quiz.no_of_questions ?? 0}
								/>
							);
						})}
				</div>
			) : (
				<div className='rounded-lg bg-white shadow p-4 mt-5 text-sm'>
					You have not given any answers. There might be an error with the test.
					<br />
					<strong>Please try reloading the page.</strong>
				</div>
			)}
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
