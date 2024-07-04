export const getRandomQuestions = (
	questions: number[],
	noOfQuestions: number
) => {
	const shuffled = questions.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, noOfQuestions);
};
