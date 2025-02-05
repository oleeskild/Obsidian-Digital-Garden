export function replaceBlockIDs(markdown: string) {
	const block_pattern = / \^([\w\d-]+)/g;
	const complex_block_pattern = /[\r\n]\^([\w\d-]+)[\r\n]/g;

	// To ensure code blocks are not modified...
	const codeBlockPattern = /```[\s\S]*?```/g;

	// Extract code blocks and replace them with placeholders
	const codeBlocks: string[] = [];

	markdown = markdown.replace(codeBlockPattern, (match) => {
		codeBlocks.push(match);

		return `{{CODE_BLOCK_${codeBlocks.length - 1}}}`;
	});

	// Replace patterns outside code blocks
	markdown = markdown.replace(
		complex_block_pattern,
		(_match: string, $1: string) => {
			return `{ #${$1}}\n\n`;
		},
	);

	markdown = markdown.replace(block_pattern, (_match: string, $1: string) => {
		return `\n{ #${$1}}\n`;
	});

	// Reinsert code blocks
	codeBlocks.forEach((block, index) => {
		markdown = markdown.replace(`{{CODE_BLOCK_${index}}}`, block);
	});

	return markdown;
}
