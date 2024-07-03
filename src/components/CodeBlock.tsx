import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { LegacyRef } from 'react';

import Markdown from 'react-markdown';
import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type Props = {
	content?: string | null;
};
export const CodeBlock = ({ content }: Props) => {
	return (
		<Markdown
			children={content}
			components={{
				code(props) {
					const { children, className, ref, ...rest } = props;
					const match = /language-(\w+)/.exec(className || '');
					return match ? (
						<SyntaxHighlighter
							{...rest}
							ref={ref as LegacyRef<SyntaxHighlighter>}
							PreTag='div'
							children={String(children).replace(/\n$/, '')}
							language={match[1]}
							style={nord}
						/>
					) : (
						<code {...rest} className={className}>
							{children}
						</code>
					);
				}
			}}
		/>
	);
};
