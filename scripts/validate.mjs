// What must be true before the protocol goes anywhere (CI on every pull request, and again before a publish).
// No dependencies: node and npm only.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const problems = [];
const check = (ok, message) => { if (!ok) problems.push(message); };

const pkg = JSON.parse(read('package.json'));
const protocol = JSON.parse(read('protocol.json'));
const prompt = read('system-prompt.md');

// One name, one version, in both files.
check(pkg.name === protocol.name, `package.json is "${pkg.name}" and protocol.json is "${protocol.name}"`);
check(pkg.version === protocol.version, `package.json is ${pkg.version} and protocol.json is ${protocol.version}`);

// The system prompt is pasted into the custom instructions of ChatGPT, which take 1500 characters.
check(prompt.length <= 1500, `system-prompt.md is ${prompt.length} characters; ChatGPT's custom instructions take 1500`);

// The prompt says each principle in short form: the first sentence of the principle must be in it, so the two cannot drift apart.
for (const principle of protocol.handshake.principles) {
  const first = principle.split(/(?<=\.)\s/)[0];
  check(prompt.includes(first), `system-prompt.md does not carry the principle "${first}"`);
}
for (const verb of protocol.verbs) {
  check(prompt.includes(verb.emoji), `system-prompt.md does not mention ${verb.emoji} (${verb.id})`);
}

// What goes to npm: the two files, plus what npm always adds.
// npm 10 and 11 print an array, npm 12 an object keyed by the package: both are read.
const out = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { encoding: 'utf8' }));
const packed = (Array.isArray(out) ? out[0] : Object.values(out)[0]).files.map((f) => f.path).sort();
const expected = ['LICENSE', 'README.md', 'package.json', 'protocol.json', 'system-prompt.md'];
check(JSON.stringify(packed) === JSON.stringify(expected), `the package would carry [${packed.join(', ')}], expected [${expected.join(', ')}]`);

// A release is a tag, and the tag is the version.
const tag = process.env.RELEASE_TAG;
if (tag) check(tag === `v${pkg.version}`, `the tag is ${tag} but package.json is ${pkg.version}`);

if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join('\n'));
  process.exit(1);
}
console.log(`✓ ${pkg.name} ${pkg.version}: ${protocol.handshake.principles.length} principles, ${protocol.verbs.length} modes, system-prompt ${prompt.length}/1500, ${packed.length} files${tag ? `, tag ${tag}` : ''}`);
