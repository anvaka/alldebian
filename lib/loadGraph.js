var fs = require('fs');
var path = require('path');
var byline = require('byline');

module.exports = loadGraph;

function loadGraph(doneCallback, fileName) {
  fileName = fileName || process.argv[2] || path.join('data', 'packages');
  if (!fs.existsSync(fileName)) {
    throw new Error('Make sure to download packages first with `download.sh`')
  }

  var stream = fs.createReadStream(fileName, {
    encoding: 'utf8'
  });
  var graph = require('ngraph.graph')({
    uniqueLinkId: false
  });
  var lastNodeId;
  stream = byline.createStream(stream);
  stream.on('data', processLine).on('end', reportResult);

  return;

  function reportResult() {
    doneCallback(graph);
  }

  function processLine(line) {
    var packageMatch = line.match(/^Package: (.+)$/)
    if (packageMatch) {
      addNode(packageMatch[1]);
      return;
    }
    var dependsMatch = line.match(/^Depends: (.+)$/);
    if (dependsMatch) {
      addDependencies(dependsMatch[1]);
    }
    if (line === '') {
      throw 'yes';
    }
  }

  function addNode(name) {
    lastNodeId = name;
    graph.addNode(name);
  }

  function addDependencies(depsString) {
    depsString.split(',').forEach(addOrDependency);
  }

  function addOrDependency(name) {
    name.split('|').forEach(addDependency);
  }

  function addDependency(name) {
    var sanitizedName = name.replace(/\(.+\)/g, '').replace(/ /g, '');
    if (sanitizedName) graph.addLink(lastNodeId, sanitizedName);
  }
}
