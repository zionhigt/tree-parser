const DirParser = require('./dir-parser');


const root = process.argv[2];
const dirParser = new DirParser(root);

(async function() {
	console.log(await dirParser.getNodes());
	console.log(await dirParser.getNodesPath());
	console.log(await dirParser.getNodesObj());
	console.log(await dirParser.getNodesJSON());
})().catch(error => {
	console.log(error);
});



