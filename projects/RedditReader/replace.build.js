var replace = require('replace-in-file');
const options = {
  files: process.argv[2],
  from: /version:.*/gm,
  to: (match) => `version: '${Date.now()}',`
};

try {
  const results = replace.sync(options)
}
catch (error) {
  console.error('Error occurred:', error);
}
