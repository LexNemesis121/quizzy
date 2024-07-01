import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import React, { useEffect } from 'react';

const CodeBlock = ({ children }: { children: React.ReactNode }) => {
	const highlightCode = () => {
		const nodes = document.querySelectorAll('pre code');
		nodes.forEach((node) => hljs.highlightBlock(node as HTMLElement));
	};

	useEffect(() => {
		highlightCode();
	}, [children]);

	return (
		<pre>
			<code>{children}</code>
		</pre>
	);
};

export default CodeBlock;
