import { Question } from '../interfaces/interfaces.ts';

export const getValidAnswersList = (data: { data: Question[] }) => {
	return data.data.reduce(
		(acc: { [key: string]: number[] }, question, index) => {
			acc[(index + 1).toString()] = question.answers
				.map((answer, i) => (answer.is_valid ? i : -1))
				.filter((index) => index !== -1);
			return acc;
		},
		{}
	);
};
