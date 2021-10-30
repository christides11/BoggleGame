// Solution based on:
// https://www.geeksforgeeks.org/boggle-set-2-using-trie/
// https://learnersbucket.com/tutorials/data-structures/trie-data-structure-in-javascript/
let surrondingNodes = [
	[1, 1],
	[0, 1],
	[-1, 1],
	[1, 0],
	[-1, 0],
	[1, -1],
	[0, -1],
	[-1, -1]
];

// we start with the TrieNode
const TrieNode = function(key) {
	// the "key" value will be the character in sequence
	this.key = key;

	// we keep a reference to parent
	this.parent = null;

	// we have hash of children
	this.children = {};

	// check to see if the node is at the end
	this.end = false;

	this.getWord = function() {
		let output = [];
		let node = this;

		while (node !== null) {
			output.unshift(node.key);
			node = node.parent;
		}

		return output.join("");
	};
};

const Trie = function() {
	this.root = new TrieNode(null);

	// inserts a word into the trie.
	this.insert = function(word) {
		let node = this.root; // we start at the root

		// for every character in the word
		for (let i = 0; i < word.length; i++) {
			// check to see if character node exists in children.
			if (!node.children[word[i]]) {
				// if it doesn't exist, we then create it.
				node.children[word[i]] = new TrieNode(word[i]);

				// we also assign the parent to the child node.
				node.children[word[i]].parent = node;
			}

			// proceed to the next depth in the trie.
			node = node.children[word[i]];

			// finally, we check to see if it's the last word.
			if (i == word.length - 1) {
				// if it is, we set the end flag to true.
				node.end = true;
			}
		}
	};

	// check if it contains a whole word.
	this.contains = function(word) {
		let node = this.root;

		// for every character in the word
		for (let i = 0; i < word.length; i++) {
			// check to see if character node exists in children.
			if (node.children[word[i]]) {
				// if it exists, proceed to the next depth of the trie.
				node = node.children[word[i]];
			} else {
				// doesn't exist, return false since it's not a valid word.
				return false;
			}
		}

		// we finished going through all the words, but is it a whole word?
		return node.end;
	};

	this.hasPrefix = function(prefix) {
		let node = this.root;

		// for every character in the prefix
		for (let i = 0; i < prefix.length; i++) {
			// make sure prefix actually has words
			if (node.children[prefix[i]]) {
				node = node.children[prefix[i]];
			} else {
				// there's none.
				return false;
			}
		}
		return true;
	};

	this.getRoot = function(prefix) {
		let node = this.root;

		for (let i = 0; i < prefix.length; i++) {
			if (node.children[prefix[i]]) {
				node = node.children[prefix[i]];
			} else {
				return null;
			}
		}
		return node;
	};

	// returns every word with given prefix
	this.find = function(prefix) {
		let node = this.root;
		let output = [];

		// for every character in the prefix
		for (let i = 0; i < prefix.length; i++) {
			// make sure prefix actually has words
			if (node.children[prefix[i]]) {
				node = node.children[prefix[i]];
			} else {
				// there's none. just return it.
				return output;
			}
		}

		// recursively find all words in the node
		findAllWords(node, output);

		return output;
	};

	// recursive function to find all words in the given node.
	const findAllWords = (node, arr) => {
		// base case, if node is at a word, push to output
		if (node.end) {
			arr.unshift(node.getWord());
		}

		// iterate through each children, call recursive findAllWords
		for (let child in node.children) {
			findAllWords(node.children[child], arr);
		}
	};

	// removes a word from the trie.
	this.remove = function(word) {
		let root = this.root;

		if (!word) return;

		// recursively finds and removes a word
		const removeWord = (node, word) => {
			// check if current node contains the word
			if (node.end && node.getWord() === word) {
				// check and see if node has children
				let hasChildren = Object.keys(node.children).length > 0;

				// if has children we only want to un-flag the end node that marks the end of a word.
				// this way we do not remove words that contain/include supplied word
				if (hasChildren) {
					node.end = false;
				} else {
					// remove word by getting parent and setting children to empty dictionary
					node.parent.children = {};
				}

				return true;
			}

			// recursively remove word from all children
			for (let key in node.children) {
				removeWord(node.children[key], word);
			}

			return false;
		};

		// call remove word on root node
		removeWord(root, word);
	};
};

function isSafe(i, j, visitedCells) {
	return (
		i >= 0 &&
		i < visitedCells.length &&
		j >= 0 &&
		j < visitedCells[0].length &&
		visitedCells[i][j] == false
	);
}

function checkChildren(i, j, grid, startNode) {
	let node = startNode;
	for (let n = 0; n < grid[i][j].length; n++) {
		if (node.children[grid[i][j][n]]) {
			node = node.children[grid[i][j][n]];
		} else {
			return null;
		}
	}
	return node;
}

function recursiveSearch(
	cellNode,
	grid,
	dictionary,
	i,
	j,
	visitedCells,
	solutionSet
) {
	// End node, found a valid string.
	if (cellNode.end) {
		let fStr = cellNode.getWord();
		solutionSet.add(fStr);
	}

	if (isSafe(i, j, visitedCells)) {
		visitedCells[i][j] = true;

		for (let k = 0; k < surrondingNodes.length; k++) {
			let indexX = i + surrondingNodes[k][0];
			let indexY = j + surrondingNodes[k][1];

			if (isSafe(indexX, indexY, visitedCells)) {
				let nextNode = checkChildren(indexX, indexY, grid, cellNode);
				if (nextNode != null) {
					recursiveSearch(
						nextNode,
						grid,
						dictionary,
						indexX,
						indexY,
						visitedCells,
						solutionSet
					);
				}
			}
		}

		visitedCells[i][j] = false;
	}
}

/**
 * Given a Boggle board and a dictionary, returns a list of available words in
 * the dictionary present inside of the Boggle board.
 * @param {string[][]} grid - The Boggle game board.
 * @param {string[]} dictionary - The list of available words.
 * @returns {string[]} solutions - Possible solutions to the Boggle board.
 */
exports.BoggleSolver = function(grid, dictionary) {
	let solutions = [];
	let wordTrie = new Trie();

	if (dictionary.length <= 0) {
		return solutions;
	}

	// Check grid size
	for (let i = 0; i < grid.length; i++) {
		if (grid[i].length != grid.length) {
			return solutions;
		}
	}

	// Insert all words into dictionary.
	for (let d = 0; d < dictionary.length; d++) {
		// Words have to be at least 3 letters long.
		if (dictionary[d].length < 3) {
			continue;
		}
		wordTrie.insert(dictionary[d].toLowerCase());
	}

	// Mark grid cells as not visited. Used while recursively searching.
	let gridCellsVisited = Array.from(
		Array(grid.length),
		() => new Array(grid[0].length)
	);
	for (let x = 0; x < gridCellsVisited.length; x++) {
		for (let y = 0; y < gridCellsVisited[0].length; y++) {
			gridCellsVisited[x][y] = false;
			grid[x][y] = grid[x][y].toLowerCase();
		}
	}

	let solutionSet = new Set();
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].length; j++) {
			// Check if the trie has words that start with the character(s) at the cell.
			let trieNode = wordTrie.getRoot(grid[i][j]);
			if (trieNode != null) {
				recursiveSearch(
					trieNode,
					grid,
					dictionary,
					i,
					j,
					gridCellsVisited,
					solutionSet
				);
			}
		}
	}
	solutions = Array.from(solutionSet);

	return solutions;
};