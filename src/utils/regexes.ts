export const FRONTMATTER_REGEX = /^\s*?---[\r\n]([\s\S]*?)[\r\n]---/g;
export const BLOCKREF_REGEX = /(\^\w+([\r\n]|$))/g;

export const CODE_FENCE_REGEX = /`(.*?)`/g;

export const CODEBLOCK_REGEX = /```.*?[\r\n][\s\S]+?```/g;

export const EXCALIDRAW_REGEX = /:\[\[(\d*?,\d*?)\],.*?\]\]/g;

export const TRANSCLUDED_SVG_REGEX =
	/!\[\[(.*?)(\.(svg))\|(.*?)\]\]|!\[\[(.*?)(\.(svg))\]\]/g;
