import { Question, Quiz } from '../interfaces/interfaces.ts';
import { useNavigate } from 'react-router-dom';
import { decimalToTime } from '../helpers/dateTime.ts';
import { buttonClass } from './Test.page.tsx';
import { useEffect, useState } from 'react';
import { quizUrlRoot } from '../helpers/appUrls.ts';
import { TestCardPreview } from '../components/TestCardPreview.tsx';
import { getValidAnswersList } from '../helpers/validAnswers.ts';

export const TestResults = (props: {
	correctAnswersCount: number;
	quiz: Quiz;
}) => {
	const navigate = useNavigate();

	const [validAnswers, setValidAnswers] = useState<{ [key: string]: number[] }>(
		{}
	);

	const [questions, setQuestions] = useState<Question[]>([]);
	useEffect(() => {
		fetch(`${quizUrlRoot}/quiz_questions`)
			.then((res) => res.json())
			.then((data: { data: Question[] }) => {
				setQuestions(data.data);
				setValidAnswers(getValidAnswersList(data));
			});
	}, []);

	const [selectedAnswers, setSelectedAnswers] = useState<{
		[key: string]: number[];
	}>();

	useEffect(() => {
		const storedAnswers = localStorage.getItem('answers');
		if (storedAnswers) {
			const parsedAnswers = JSON.parse(storedAnswers);
			setSelectedAnswers(parsedAnswers ?? []);
			console.log(parsedAnswers);
		}
		// localStorage.removeItem('answers');
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
			<div className={'mt-5 flex flex-col gap-5'}>
				{questions.map((question) => {
					return (
						<TestCardPreview
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
