let urlNode = {
  sh: 'http://10.11.4.167:7777',
  dx: 'http://119.96.232.57:7777',
}
module.exports = {
  generate(node, path) {
    let host = urlNode[node];
    if (!host) {
      return null;
    }

  },
}
