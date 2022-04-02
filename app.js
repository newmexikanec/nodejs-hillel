const yargs = require("yargs");
const { info, error } = require("./utils/logger");
const fileSeeker = require("./utils/fileSeeker");

const args = yargs(process.argv).argv;

if (!args.target || !args.dirPath) {
    error("--target and --dirPath arguments are required");
    process.exit(1);
}

fileSeeker.seek(args.target, args.dirPath);

fileSeeker.emitter.addListener('fail', err => {
    error("[FILE UTILS][ERROR]", err.toString());
});
fileSeeker.emitter.addListener('success', file => {
    info(`[FILE UTILS][SUCCESS] file "${file}" was found`);
});
