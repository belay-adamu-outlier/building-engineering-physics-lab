const INDOOR = 20;

const RESIST = {
  thin: 1,
  typical: 3,
  thick: 6,
};

const MOISTURE = ['none', 'permeable', 'impermeable'];

function drive(tout) {
  if (tout < INDOOR) {
    return 'out';
  }
  if (tout > INDOOR) {
    return 'in';
  }
  return 'none';
}

function heatLabel(flow) {
  if (Math.abs(flow) <= 0.05) {
    return 'Estimated 0 W/m²';
  }
  const shown = Math.round(Math.abs(flow));
  const text = shown < 1 ? '<1' : String(shown);
  if (flow > 0) {
    return 'Estimated ' + text + ' W/m² out';
  }
  return 'Estimated ' + text + ' W/m² in';
}

function heatDir(flow) {
  if (flow > 0.05) {
    return 'out';
  }
  if (flow < -0.05) {
    return 'in';
  }
  return 'none';
}

function dryingState(flags) {
  if (flags.rainEnters) {
    return {
      moistureLabel: 'Rain in the insulation',
      dryDir: 'rain',
    };
  }
  if (!flags.outwardOpen && !flags.inwardOpen) {
    return {
      moistureLabel: 'Trapped in the wall',
      dryDir: 'trapped',
    };
  }
  if (!flags.outwardOpen && flags.way === 'in') {
    return {
      moistureLabel: 'Drying inward',
      dryDir: 'inward',
    };
  }
  if (!flags.outwardOpen && flags.way === 'out') {
    return {
      moistureLabel: 'Cannot dry outward',
      dryDir: 'blocked',
    };
  }
  if (!flags.outwardOpen) {
    return {
      moistureLabel: 'Cannot dry outward',
      dryDir: 'closed',
    };
  }
  if (!flags.inwardOpen && flags.way === 'out') {
    return {
      moistureLabel: 'Drying outward',
      dryDir: 'out',
    };
  }
  if (!flags.inwardOpen && flags.way === 'in') {
    return {
      moistureLabel: 'Slow to dry',
      dryDir: 'slow',
    };
  }
  if (!flags.inwardOpen) {
    return {
      moistureLabel: 'Little drying',
      dryDir: 'none',
    };
  }
  if (flags.way === 'out') {
    return {
      moistureLabel: 'Vapor entering the wall',
      dryDir: 'enter',
    };
  }
  if (flags.way === 'in') {
    return {
      moistureLabel: 'Drying inward',
      dryDir: 'inward',
    };
  }
  return {
    moistureLabel: 'Little drying',
    dryDir: 'none',
  };
}

function wetnessFor(flags) {
  if (flags.rainEnters) {
    return 0.85;
  }
  if (!flags.outwardOpen && !flags.inwardOpen) {
    return flags.way === 'out' ? 0.72 : 0.4;
  }
  if (!flags.outwardOpen && flags.way === 'out') {
    return 0.7;
  }
  if (!flags.outwardOpen) {
    return 0.15;
  }
  if (!flags.inwardOpen && flags.way === 'in') {
    return 0.45;
  }
  if (flags.way === 'out' && flags.inwardOpen) {
    return 0.4;
  }
  if (flags.way === 'out') {
    return 0.12;
  }
  if (flags.way === 'in') {
    return 0.12;
  }
  return 0.08;
}

/** Illustrative heat and moisture for one wall section. */
export function wallState(input) {
  const source = input || {};
  const tempOut = Number(source.tempOut);
  const tout = Number.isFinite(tempOut) ? tempOut : 0;
  const insulation = RESIST[source.insulation]
    ? source.insulation
    : 'typical';
  const moisture = MOISTURE.includes(source.moistureBarrier)
    ? source.moistureBarrier
    : 'none';
  const rain = Boolean(source.rain);
  const vapor = Boolean(source.vaporBarrier);
  const flow = (INDOOR - tout) / RESIST[insulation];
  const flags = {
    way: drive(tout),
    outwardOpen: moisture !== 'impermeable',
    inwardOpen: !vapor,
    rainEnters: rain && moisture === 'none',
  };
  const drying = dryingState(flags);

  return {
    heatLabel: heatLabel(flow),
    heatDir: heatDir(flow),
    moistureLabel: drying.moistureLabel,
    dryDir: drying.dryDir,
    wetness: wetnessFor(flags),
  };
}
