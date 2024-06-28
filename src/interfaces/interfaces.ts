export type Quiz = {
	id: number;
	quiz_name: string;
	pass_mark: number;
	time_per_question: string;
	remarks: { remark: string }[];
	questions: [number, number];
};

export type Answer = {
	answer: string;
	is_valid?: boolean;
};

export type Question = {
	id: number;
	question: string;
	multiple_choice: boolean;
	tag: string;
	answers: Answer[];
	code_snippet: string;
};
