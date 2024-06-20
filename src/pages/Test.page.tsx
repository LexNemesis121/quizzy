import { TestCard } from '../components/TestCard.tsx';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { quizUrlRoot } from '../helpers/appUrls.ts';
import { Quiz } from '../interfaces/interfaces.ts';

const getNextPage = (lastPage: number, currentPage: string | undefined) => {
	const _currentPage = currentPage ? Number(currentPage) : 0;
	if(_currentPage+1 > lastPage){
		return 'finish'
	}
	return _currentPage + 1 === lastPage ? lastPage : (_currentPage === 0 ? 1 : _currentPage) + 1;
}

const getPreviousPage = (currentPage: string | undefined) => {
	const _currentPage = currentPage ? Number(currentPage) : 0;
	return _currentPage - 1 <= 0 ? 1 : _currentPage - 1;
}

const isLastPage = (lastPage: number, currentPage: string | undefined) => {
	const _currentPage = currentPage ? Number(currentPage) : 0;
	return _currentPage + 1 > lastPage;
}

const isFirstPage = (currentPage: string | undefined) => {
	const _currentPage = currentPage ? Number(currentPage) : 0;
	return _currentPage === 0 || _currentPage === 1;
}

const buttonClass = 'bg-indigo-600 flex-1 text-white shadow-sm hover:bg-indigo-500 mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
const disabledButtonClass = 'bg-gray-200 pointer-events-none cursor-not-allowed flex-1 text-white shadow-sm hover:bg-indigo-500 mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';

export const TestPage = () => {
	const {id, qid} = useParams();
	const [quiz, setQuiz] = useState<Quiz | undefined>(undefined);

	useEffect(() => {
		fetch(`${quizUrlRoot}/quiz/${id}`).then(res => res.json()).then((data: { data: Quiz }) => setQuiz(data.data));
	}, [id]);

	if (!quiz) return null;
	return (
		<>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<div className="container">
						<h1 className="text-xl mb-10 font-bold tracking-tight text-gray-900 sm:text-xl">{quiz.quiz_name}</h1>
					</div>
					<div>
						<div>Time left:</div>
						<div>00:12:58</div>
						<div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
							<div className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500" style={{width: "45%"}}></div>
						</div>
					</div>

					<TestCard questionId={Number(qid ?? 1)} questionNumber={Number(qid ?? 0)}
										questionTotal={quiz.questions?.length ?? 0}/>
					<div className={'flex flex-row gap-3'}>
						<a
							href={`/test/${id}/${getPreviousPage(qid)}`}
							className={`${isFirstPage(qid) ? disabledButtonClass : buttonClass}`}
						>
							Previous
						</a>
						<a
							href={`/test/${id}/${getNextPage(quiz.questions.length, qid)}`}
							className={buttonClass}
						>
							{isLastPage(quiz.questions.length, qid) ? 'Finish' : 'Next'}
						</a>
					</div>
				</div>
			</div>
		</>
	);
};
