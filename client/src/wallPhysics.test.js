import assert from 'node:assert/strict';
import test from 'node:test';
import { wallState } from './wallPhysics.js';

const coldRain = {
  tempOut: -5,
  insulation: 'typical',
  rain: true,
};

test('rain with no moisture barrier wets the insulation', () => {
  const state = wallState({
    ...coldRain,
    moistureBarrier: 'none',
    vaporBarrier: false,
  });
  assert.equal(state.moistureLabel, 'Rain in the insulation');
  assert.ok(state.wetness > 0.7);
});

test('a permeable barrier can dry when the vapor barrier is on', () => {
  const state = wallState({
    ...coldRain,
    moistureBarrier: 'permeable',
    vaporBarrier: true,
  });
  assert.equal(state.moistureLabel, 'Drying outward');
  assert.ok(state.wetness < 0.2);
});

test('impermeable plus a vapor barrier traps moisture', () => {
  const state = wallState({
    ...coldRain,
    moistureBarrier: 'impermeable',
    vaporBarrier: true,
  });
  assert.equal(state.moistureLabel, 'Trapped in the wall');
});

test('impermeable without a vapor barrier cannot dry outward', () => {
  const state = wallState({
    tempOut: -5,
    insulation: 'typical',
    rain: false,
    moistureBarrier: 'impermeable',
    vaporBarrier: false,
  });
  assert.equal(state.moistureLabel, 'Cannot dry outward');
});

test('thicker insulation cuts the heat leaving the room', () => {
  const thin = wallState({
    tempOut: -5,
    insulation: 'thin',
    rain: false,
  });
  const thick = wallState({
    tempOut: -5,
    insulation: 'thick',
    rain: false,
  });
  assert.match(thin.heatLabel, /W\/m² out/);
  assert.match(thick.heatLabel, /W\/m² out/);
  const thinFlow = Number(thin.heatLabel.match(/\d+/)[0]);
  const thickFlow = Number(thick.heatLabel.match(/\d+/)[0]);
  assert.ok(thickFlow < thinFlow);
});

test('hot outdoor air drives heat inward', () => {
  const state = wallState({
    tempOut: 32,
    insulation: 'typical',
    rain: false,
    moistureBarrier: 'permeable',
    vaporBarrier: true,
  });
  assert.match(state.heatLabel, /in$/);
});

test('arrow directions follow heat and drying', () => {
  const drying = wallState({
    ...coldRain,
    moistureBarrier: 'permeable',
    vaporBarrier: true,
  });
  assert.equal(drying.heatDir, 'out');
  assert.equal(drying.dryDir, 'out');

  const trapped = wallState({
    ...coldRain,
    moistureBarrier: 'impermeable',
    vaporBarrier: true,
  });
  assert.equal(trapped.dryDir, 'trapped');

  const soaked = wallState({
    ...coldRain,
    moistureBarrier: 'none',
    vaporBarrier: false,
  });
  assert.equal(soaked.dryDir, 'rain');

  const hot = wallState({
    tempOut: 32,
    insulation: 'typical',
    rain: false,
    moistureBarrier: 'permeable',
    vaporBarrier: true,
  });
  assert.equal(hot.heatDir, 'in');

  const blocked = wallState({
    tempOut: -5,
    insulation: 'typical',
    rain: false,
    moistureBarrier: 'impermeable',
    vaporBarrier: false,
  });
  assert.equal(blocked.dryDir, 'blocked');

  const slow = wallState({
    tempOut: 32,
    insulation: 'typical',
    rain: false,
    moistureBarrier: 'permeable',
    vaporBarrier: true,
  });
  assert.equal(slow.dryDir, 'slow');
  assert.equal(slow.heatDir, 'in');

  const entering = wallState({
    tempOut: 0,
    insulation: 'typical',
    rain: false,
    moistureBarrier: 'none',
    vaporBarrier: false,
  });
  assert.equal(entering.moistureLabel, 'Vapor entering the wall');
  assert.equal(entering.dryDir, 'enter');
  assert.equal(entering.heatDir, 'out');

  const balanced = wallState({
    tempOut: 20,
    insulation: 'typical',
    rain: false,
    moistureBarrier: 'permeable',
    vaporBarrier: true,
  });
  assert.equal(balanced.heatDir, 'none');
});

test('unknown inputs fall back without throwing', () => {
  const state = wallState({
    tempOut: 'nope',
    insulation: 'foam',
    moistureBarrier: 'paper',
  });
  assert.equal(state.moistureLabel, 'Vapor entering the wall');
  assert.match(state.heatLabel, /out/);
});

function expectedDrying(tempName, moisture, vapor, rain) {
  if (rain && moisture === 'none') {
    return ['Rain in the insulation', 'rain'];
  }
  if (moisture === 'impermeable' && vapor) {
    return ['Trapped in the wall', 'trapped'];
  }
  if (moisture === 'impermeable' && tempName === 'hot') {
    return ['Drying inward', 'inward'];
  }
  if (moisture === 'impermeable' && tempName === 'cold') {
    return ['Cannot dry outward', 'blocked'];
  }
  if (moisture === 'impermeable') {
    return ['Cannot dry outward', 'closed'];
  }
  if (vapor && tempName === 'cold') {
    return ['Drying outward', 'out'];
  }
  if (vapor && tempName === 'hot') {
    return ['Slow to dry', 'slow'];
  }
  if (!vapor && tempName === 'cold') {
    return ['Vapor entering the wall', 'enter'];
  }
  if (!vapor && tempName === 'hot') {
    return ['Drying inward', 'inward'];
  }
  return ['Little drying', 'none'];
}

test('every control combination follows the drying rules', () => {
  const temps = [
    ['cold', -5, 'out'],
    ['mild', 20, 'none'],
    ['hot', 32, 'in'],
  ];
  const barriers = ['none', 'permeable', 'impermeable'];
  const tempsAndBarriers = temps.flatMap((temp) => (
    barriers.map((moisture) => [temp, moisture])
  ));

  tempsAndBarriers.forEach(([[tempName, tempOut, heat], moisture]) => {
    [false, true].forEach((vapor) => {
      [false, true].forEach((rain) => {
        const state = wallState({
          tempOut,
          insulation: 'typical',
          rain,
          vaporBarrier: vapor,
          moistureBarrier: moisture,
        });
        const expected = expectedDrying(
          tempName,
          moisture,
          vapor,
          rain,
        );
        const name = [
          tempName,
          moisture,
          vapor ? 'vapor' : 'open-inside',
          rain ? 'rain' : 'dry',
        ].join(' ');
        assert.equal(state.moistureLabel, expected[0], name);
        assert.equal(state.dryDir, expected[1], name);
        assert.equal(state.heatDir, heat, name);
        if (moisture === 'impermeable') {
          assert.notEqual(state.dryDir, 'out', name);
          assert.notEqual(
            state.moistureLabel,
            'Drying outward',
            name,
          );
        }
      });
    });
  });
});

test('insulation thickness does not change drying direction', () => {
  ['thin', 'typical', 'thick'].forEach((insulation) => {
    const state = wallState({
      tempOut: -5,
      insulation,
      rain: false,
      moistureBarrier: 'impermeable',
      vaporBarrier: false,
    });
    assert.equal(state.moistureLabel, 'Cannot dry outward');
    assert.equal(state.dryDir, 'blocked');
  });
});
