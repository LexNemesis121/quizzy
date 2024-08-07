import { useEffect, useState } from 'react';
import { QuizCard } from './components/QuizCard.tsx';
import { checkAndResetTimer, decimalToTime } from './helpers/dateTime.ts';
import { quizUrlRoot } from './helpers/appUrls.ts';
import { Quiz } from './interfaces/interfaces.ts';

function App() {
	const [quizes, setQuizes] = useState<Quiz[]>([]);

	useEffect(() => {
		fetch(
			`${quizUrlRoot}/quiz?fields=id,quiz_name,pass_mark,time_per_question,remarks,no_of_questions`
		)
			.then((res) => res.json())
			.then((data: { data: Quiz[] }) => setQuizes(data.data));
	}, []);

	useEffect(() => {
		document.addEventListener('contextmenu', (event) => {
			event.preventDefault();
		});
		checkAndResetTimer();
	}, []);

	return (
		<>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-3xl'>
					<div className='container'>
						<h1 className='text-3xl mb-10 font-bold tracking-tight text-gray-900 sm:text-6xl'>
							Welcome Test Taker
						</h1>
						<p className='mb-6 text-lg leading-8 text-gray-600'>
							Please choose from one of the tests below:
						</p>
					</div>
					{quizes.map((quiz) => {
						return (
							<QuizCard
								title={quiz.quiz_name}
								key={quiz.id}
								buttonUrl={quiz.id.toString()}
								buttonLabel={'View Details'}
								testTime={
									Number(quiz?.time_per_question ?? 0.5) *
									(quiz?.no_of_questions ?? 0) *
									60 *
									1000
								}
							>
								<>
									<div className={'text-sm leading-6 text-gray-600'}>
										Number of questions:{' '}
										<span className={'text-sm font-bold text-gray-900'}>
											{quiz.no_of_questions ?? 0}
										</span>
									</div>
									<div className={'text-sm leading-6 text-gray-600'}>
										Duration of test:{' '}
										<span className={'text-sm font-bold text-gray-900'}>
											{decimalToTime(
												(quiz.no_of_questions ?? 0) *
													Number(quiz.time_per_question)
											)}
										</span>
									</div>
								</>
							</QuizCard>
						);
					})}
				</div>
			</div>
		</>
	);
}

export default App;
