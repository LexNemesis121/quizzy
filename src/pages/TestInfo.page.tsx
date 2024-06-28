import { QuizCard } from '../components/QuizCard.tsx';
import { decimalToTime } from '../helpers/dateTime.ts';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { quizUrlRoot } from '../helpers/appUrls.ts';
import { Quiz } from '../interfaces/interfaces.ts';

export const TestInfoPage = () => {
	const { id } = useParams();
	const [quiz, setQuiz] = useState<Quiz | undefined>(undefined);

	useEffect(() => {
		fetch(`${quizUrlRoot}/quiz/${id}`)
			.then((res) => res.json())
			.then((data: { data: Quiz }) => setQuiz(data.data));
	}, []);

	if (!quiz) return null;
	return (
		<>
			<div className='mx-auto w-[600px] px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto w-[600px]'>
					<div className='container'>
						<h1 className='text-lg mb-5 font-bold tracking-tight text-gray-900 sm:text-lg'>
							{quiz.quiz_name}
						</h1>
					</div>
					<QuizCard
						title={'Instructions'}
						buttonUrl={'/test/1'}
						buttonLabel={'Take Test'}
					>
						<>
							<div className={'text-sm leading-6 text-gray-600'}>
								Number of questions:{' '}
								<span className={'text-sm font-bold text-gray-900'}>
									{quiz.questions?.length ?? 0}
								</span>
							</div>
							<div className={'text-sm leading-6 text-gray-600'}>
								Duration of test:{' '}
								<span className={'text-sm font-bold text-gray-900'}>
									{decimalToTime(
										(quiz.questions?.length ?? 0) *
											Number(quiz.time_per_question)
									)}
								</span>
							</div>
							<div className={'text-sm leading-6 text-gray-600'}>
								Questions displayed per page:{' '}
								<span className={'text-sm font-bold text-gray-900'}>1</span>
							</div>
							{quiz.remarks.map((remark, index) => {
								return (
									<div
										key={index}
										className={'text-sm leading-6 text-gray-600'}
									>
										{remark.remark}
									</div>
								);
							})}
							<div className={'text-sm leading-6 text-gray-600'}>
								Passing grade percentage:{' '}
								<span className={'text-sm font-bold text-gray-900'}>
									{quiz.pass_mark} %
								</span>
							</div>
						</>
					</QuizCard>
				</div>
			</div>
		</>
	);
};
