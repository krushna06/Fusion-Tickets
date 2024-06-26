const pkg = require('../package.json');
const banner = require('./lib/banner');
banner(pkg.version); // print big title

const semver = require('semver');
const { colours } = require('leeks.js');
const path = require('path');

// check node version
if (!semver.satisfies(process.versions.node, pkg.engines.node)) {
	console.log('\x07' + colours.redBright(`Error: Your current Node.js version, ${process.versions.node}, does not meet the requirement "${pkg.engines.node}". Please update to version ${semver.minVersion(pkg.engines.node).version} or higher.`));
	process.exit(1);
}

const base_dir = path.resolve(path.join(__dirname, '../'));
const cwd = path.resolve(process.cwd());
if (base_dir !== cwd) {
	console.log('\x07' + colours.yellowBright('Warning: The current working directory is not the same as the base directory.'));
	if (!process.env.DOCKER) {
		console.log(colours.yellowBright('This may result in unexpected behaviour, particularly with missing environment variables.'));
	}
	console.log('  Base directory:    ' + colours.gray(base_dir));
	console.log('  Current directory: ' + colours.gray(cwd));
}

// this could be done first, but then there would be no banner :(
process.env.NODE_ENV ??= 'production'; // make sure NODE_ENV is set
require('./env').load(); // load and check environment variables

const fs = require('fs');
const YAML = require('yaml');
const logger = require('./lib/logger');
const Client = require('./client');
const http = require('./http');

// user directory may or may not exist depending on if sqlite is being used
// so the config file could be missing even though the directory exists
if (!fs.existsSync('./user/config.yml')) {
	console.log('The config file does not exist, copying defaults...');
	fs.cpSync(path.join(__dirname, 'user'), './user', { recursive: true });
	console.log('Created user directory at', path.join(cwd, 'user'));
}

const config = YAML.parse(fs.readFileSync('./user/config.yml', 'utf8'));
const log = logger(config);

process.on('uncaughtException', (error, origin) => {
	log.notice(`Discord Tickets v${pkg.version} on Node.js ${process.version} (${process.platform})`);
	log.warn(origin === 'uncaughtException' ? 'Uncaught exception' : 'Unhandled promise rejection' + ` (${error.name})`);
	log.error(error);
});

process.on('warning', warning => log.warn(warning.stack || warning));

const client = new Client(config, log);
client.login().then(() => {
	http(client);
});
