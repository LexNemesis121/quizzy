import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import React, { useEffect, useRef } from 'react';

const CodeBlock = ({
	children,
	language = 'typescript'
}: {
	children: React.ReactNode;
	language?: string;
}) => {
	const codeRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (codeRef.current) {
			if (codeRef.current.dataset.highlighted) {
				codeRef.current.innerHTML = codeRef.current.textContent || '';
			}
			hljs.highlightElement(codeRef.current);
			codeRef.current.dataset.highlighted = 'yes';
		}
	}, [children]);

	return (
		<pre>
			<code ref={codeRef} className={`language-${language}`}>
				{children}
			</code>
		</pre>
	);
};

export default CodeBlock;
