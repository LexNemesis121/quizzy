import { useEffect, useState } from 'react';
import { quizUrlRoot } from '../helpers/appUrls.ts';
import { Question } from '../interfaces/interfaces.ts';
import { CodeBlock } from './CodeBlock.tsx';

export const indexToLetter = (index: number): string =>
	String.fromCharCode(65 + index);

export const TestCard = ({
	questionId,
	questionNumber,
	questionTotal,
	changeAnswers
}: {
	questionId: number;
	questionNumber: number;
	questionTotal: number;
	changeAnswers: (answer: { [key: string]: number[] }) => void;
}) => {
	const [question, setQuestion] = useState<Question | undefined>(undefined);
	const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

	useEffect(() => {
		const storedAnswers = localStorage.getItem('answers');
		if (storedAnswers) {
			const parsedAnswers = JSON.parse(storedAnswers);
			setSelectedAnswers(parsedAnswers[questionId] ?? []);
		}
	}, [questionId]);

	useEffect(() => {
		fetch(`${quizUrlRoot}/quiz_questions/${questionId}`)
			.then((res) => res.json())
			.then((data: { data: Question }) => setQuestion(data.data));
	}, [questionId]);

	const handleChange = (index: number) => {
		if (question?.multiple_choice) {
			const updatedAnswers = selectedAnswers.includes(index)
				? selectedAnswers.filter((i) => i !== index)
				: [...selectedAnswers, index];
			setSelectedAnswers(updatedAnswers);
			changeAnswers({ [questionId]: updatedAnswers });
		} else {
			setSelectedAnswers([index]);
			changeAnswers({ [questionId]: [index] });
		}
	};

	return (
		<div className='divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow w-[600px]'>
			<div className='px-4 py-5 sm:px-6 bg-gray-100'>
				<h4 className={'text-sm font-semibold leading-8 text-gray-700'}>
					Question {questionNumber === 0 ? 1 : questionNumber} of{' '}
					{questionTotal}
				</h4>
			</div>
			<div className='px-4 py-5 sm:p-6 flex flex-col gap-5'>
				<div>{question?.question}</div>
				<div>
					{question?.code_snippet && (
						<CodeBlock content={question?.code_snippet} />
					)}
				</div>
				<div className='space-y-2'>
					{question?.answers.map((answer, i) => {
						return (
							<div
								key={`answer-${questionId}-${i}`}
								className='relative flex items-start'
							>
								<div className='flex h-6 items-center'>
									<input
										onChange={() => handleChange(i)}
										id={`${answer.answer.length}-${questionId}-${i}`}
										name={`question-${questionId}`}
										type={question?.multiple_choice ? 'checkbox' : 'radio'}
										className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
										checked={selectedAnswers.includes(i)}
									/>
								</div>
								<div className='ml-3 text-sm leading-6'>
									<label
										htmlFor={`${answer.answer.length}-${questionId}-${i}`}
										className='font-medium text-gray-900'
									>
										<span className={'font-bold mr-1'}>
											{indexToLetter(i)}.
										</span>
										{answer.answer}
									</label>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
