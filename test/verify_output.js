const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const recordFilePath = path.join(__dirname, 'expected_output.txt');
const expected = fs.readFileSync(recordFilePath).toString('utf8');

const script = process.argv[2];
if (!script) {
    console.error('expected 1 argument, but got zero');
    process.exit(1);
}
if (!fs.existsSync(script)) {
    console.error('failed to resolve script');
    process.exit(1);
}

exec(`node ${script}`, {}, (err, stdout) => {
    if (err) {
        console.dir(err);
        process.exit(1);
    }
    if (stdout !== expected) {
        console.log('FAIL: stdout did not match expected record');
        console.log('');
        console.log('ACTUAL\n======');
        stdout.split('\n').forEach(item => console.log('>', item));
        console.log('');
        console.log('');
        console.log('EXPECTED\n========');
        expected.split('\n').forEach(item => console.log('>', item));   
        process.exit(1);
    }
    console.log('PASS: stdout matched expected record');
    process.exit(0);
})