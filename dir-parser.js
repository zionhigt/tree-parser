const fs = require('fs');
const path = require('path');

class DirParser {
	constructor(root) {
		this.root = root;
		this.nodes = [];
		this.nodesObj = {};
		this.paths = [];
	}
}
DirParser.prototype.use = function(arg) {
	console.log(arg);
	return this;
}
DirParser.prototype.getFolderNodes = async function(root) {
	const directory = await fs.promises.readdir(root);
	for(let childIdx in directory) {
		var pathChild = path.join(root, directory[childIdx]);
		var stat = await fs.promises.stat(pathChild);
		if(stat.isDirectory()) {
			this.paths.push(pathChild);
			await this.getFolderNodes(pathChild);
		}
	}
	return this.paths;
	
}
DirParser.prototype.maper = function(path) {	
	const explodedPath = path.split('/');
	var nodes = [];
	for(let nodeIdx in explodedPath) {
		var nodeName = explodedPath[nodeIdx];
		var nodeParentIdx = nodeIdx > 0 ? nodeIdx -1 : -1;
		var nodeParentName = nodeParentIdx >= 0 ? explodedPath[nodeParentIdx] : "self";
		var node = new Object({
			"name": nodeName,
			"parent": nodeParentName,
			"deep": parseInt(nodeIdx)
		});
		nodes.push(JSON.stringify(node));
	}
	return nodes;
}
DirParser.prototype.refreshNodes = async function() {
	this.nodes = [];
	this.nodesObj = {};
	this.paths = [];
	await this.getNodes(true);
	await this.getNodesObj(true);
	await this.getNodesJSON(true);
}
DirParser.prototype.getNodes = async function(refresh=false) {
	if (this.nodes.length == 0 || refresh) {
		var paths = await this.getFolderNodes(this.root).catch(err => console.log(err))
		var nodes = [];
		paths.forEach(function (path) {
			nodes = nodes.concat(this.maper(path));
		}.bind(this));

		this.nodes = nodes
		.filter(function (node, idx) {
			return nodes.indexOf(node) == idx;
		}.bind(this))
		.map(function (node) {
			return JSON.parse(node);
		}.bind(this))
		.sort(function (a, b) {
			if (a.deep < b.deep) {
				return -1;
			}
		});
	}
	return this.nodes;
}
DirParser.prototype.nodeToPath = function(node) {
	var nodePath = "";
	var parentNode = this.nodes.filter(function(n) {
		return node.parent == n.name;
	}.bind(this));
	if(parentNode.length > 0) {
		var parentName = parentNode[0].name;
		nodePath = `${parentName}/${node.name}`;
		if(parentNode[0].deep > 0) {
			nodePath = `${this.nodeToPath(parentNode[0])}/${node.name}`
		}
	} else {
		nodePath = node.name;
	}
	return nodePath;
}
DirParser.prototype.getNodesPath = async function(refresh=false) {
	if(this.paths.length == 0 || refresh) {
		var nodes = await this.getNodes();
		this.paths = nodes.map(function (node) {
			return this.nodeToPath(node);
		}.bind(this));
	}
	return this.paths;
}
DirParser.prototype.getNodesObj = async function(refresh=false) {
	if(Object.keys(this.nodesObj).length == 0 || refresh) {
		var paths = await this.getNodesPath(refresh);
		paths.forEach(function (pathNode) {
			var explodedPath = pathNode.split("/");
			var currentKey = this.nodesObj;
			for (var node of explodedPath) {
				currentKey[node] = { ...currentKey[node] };
				currentKey = currentKey[node];
			}
		}.bind(this));
	}
	return this.nodesObj;
}
DirParser.prototype.getNodesJSON = async function(refresh=false) {
	var nodesObj = await this.getNodesObj(refresh);
	return JSON.stringify(nodesObj);
}


module.exports = DirParser;