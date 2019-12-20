const
	os = require('os'),
	fs = require('fs'),
	fsExtra = require('fs-extra'),
	uglifyES = require('uglify-es'),
	minifyOptions = {
		toplevel: true
	};

process.stdout.write('\x1B[32mSTARTING...\x1B[0m' + os.EOL);

process.stdout.write('cleaning "dist"...');
fsExtra.emptyDirSync('./dist');
process.stdout.write('\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('installing "data-tier"...');
fsExtra.emptyDirSync('./src/data-tier');
fsExtra.copySync('./node_modules/data-tier/dist', './src/data-tier');
fsExtra.removeSync('./src/data-tier/data-tier.js');
fsExtra.removeSync('./src/data-tier/dt-utils.js');
process.stdout.write('\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('building "dist"...');
fsExtra.copySync('./src', './dist');
process.stdout.write('\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('- minifying...');
fs.writeFileSync(
	'./dist/i18n.min.js',
	uglifyES.minify(fs.readFileSync('./dist/i18n.js', { encoding: 'utf8' }), minifyOptions).code
);
process.stdout.write('\t\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('\x1B[32mDONE\x1B[0m' + os.EOL);