#!/usr/bin/env node

const child_process = require('child_process');
const path = require('path');
const _ = require('lodash');

const PROJECT_ROOT = __dirname;

console.log(`Building project from ${PROJECT_ROOT}`);

const SOURCE_DIRS = [
  [path.join(PROJECT_ROOT, 'src'), path.join(PROJECT_ROOT, 'lib')]
];

// Remove the previously built versions
console.log('\nRemoving directories...');
_.pluck(SOURCE_DIRS, 1).forEach(function(outputDir) {
  console.log(`Removing ${outputDir}`);
  const rm = child_process.spawnSync('rm', ['-rf', outputDir]);

  const stderr = rm.stderr.toString();
  if (stderr) {
    throw new Error(stderr);
  }

  const stdout = rm.stdout.toString();
  if (stdout) {
    console.log(stdout);
  }
});

// Rebuild from the source files
console.log('\nRebuilding and watching directories...');
_.forEach(SOURCE_DIRS, (dirs) => {
  const sourceDir = dirs[0];
  const outputDir = dirs[1];

  const babel = child_process.spawn(
    path.join(PROJECT_ROOT, 'node_modules', '.bin', 'babel'),
    [sourceDir, '--out-dir', outputDir, '--source-maps', 'inline', '--watch', '--copy-files']
  );

  babel.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  babel.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
});
