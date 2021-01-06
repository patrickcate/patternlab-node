'use strict';

const path = require('path');
const tap = require('tap');

const loadPattern = require('../src/lib/loadPattern');
const util = require('./util/test_utils.js');
const patternEngines = require('../src/lib/pattern_engines');
var config = require('./util/patternlab-config.json');

patternEngines.loadAllEngines(config);

const patterns_dir = `${__dirname}/files/_patterns`;

tap.test('loadPattern - returns null if file is not a pattern', function(test) {
  //arrange
  const patternlab = util.fakePatternLab(patterns_dir);
  var patternPath = path.join('test', 'styled-atom.json');

  //act
  var result = loadPattern(patternPath, patternlab);

  //assert
  test.equals(result, null);
  test.end();
});

tap.test('loadPattern - loads pattern sibling json if found', function(test) {
  //arrange
  const patternlab = util.fakePatternLab(patterns_dir);
  var patternPath = path.join('test', 'styled-atom.mustache');

  //act
  var result = loadPattern(patternPath, patternlab);

  //assert
  test.equals(result.jsonFileData.message, 'baseMessage');
  test.end();
});

tap.test(
  'loadPattern - adds the pattern to the patternlab.partials object',
  function(test) {
    //arrange
    const patternlab = util.fakePatternLab(patterns_dir);
    var fooPatternPath = path.join('test', 'bar.mustache');

    //act
    var result = loadPattern(fooPatternPath, patternlab);

    //assert
    test.equals(util.sanitized(patternlab.partials['test-bar']), 'bar');
    test.end();
  }
);

tap.test('loadPattern - returns pattern with template populated', function(
  test
) {
  //arrange
  const patternlab = util.fakePatternLab(patterns_dir);
  var fooPatternPath = path.join('test', 'bar.mustache');

  //act
  var result = loadPattern(fooPatternPath, patternlab);

  //assert
  test.equals(util.sanitized(result.template), util.sanitized('bar'));
  test.end();
});

// TODO: Fix doc pattern test when new logic in loadPattern is implemented
// tap.test('loadPattern - adds a markdown pattern if encountered', function(
//   test
// ) {
//   //arrange
//   const patternlab = util.fakePatternLab(patterns_dir);
//   var colorsMarkDownPath = path.join('patternGroup1', 'patternSubgroup1.md');

//   //act
//   var result = loadPattern(colorsMarkDownPath, patternlab);

//   //assert
//   const subgroupPattern =
//     patternlab.subgroupPatterns['patternGroup1-patternSubgroup1'];
//   test.equals(subgroupPattern.patternSectionSubgroup, true);
//   test.equals(subgroupPattern.isPattern, false);
//   test.equals(subgroupPattern.patternDesc, '<p>Colors</p>\n');
//   test.equals(subgroupPattern.engine, null);
//   test.equals(
//     subgroupPattern.flatPatternPath,
//     'patternGroup1-patternSubgroup1'
//   );
//   test.equals(result, subgroupPattern);
//   test.end();
// });

tap.test(
  'loadPattern - does not load pseudopattern data on the base pattern',
  test => {
    //arrange
    const patternlab = util.fakePatternLab(patterns_dir);
    const basePatternPath = path.join('test', 'pseudomodifier.mustache');

    //act
    const result = loadPattern(basePatternPath, patternlab);

    //assert
    test.same(result.jsonFileData, {});

    test.end();
  }
);
