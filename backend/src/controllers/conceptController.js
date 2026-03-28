const conceptGraph = require('../data/concept-graph.json');

function getConceptGraph(req, res) {
  res.json({ graph: conceptGraph });
}

module.exports = { getConceptGraph };
