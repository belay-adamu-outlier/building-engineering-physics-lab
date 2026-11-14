import { useState } from 'react';
import styled from 'styled-components';
import { wallState } from '../wallPhysics.js';

const cavityDepth = {
  thin: 28,
  typical: 40,
  thick: 54,
};

const Bench = styled.section`
  margin: 0.2rem 0 2rem;
  padding-top: 1.15rem;
  border-top: 1px solid ${(p) => p.theme.line};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.05rem;
`;

const Note = styled.p`
  margin: 0.3rem 0 0.65rem;
  color: ${(p) => p.theme.muted};
  font-size: 0.85rem;
`;

const Sheet = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  background: #ffffff;
`;

const Readout = styled.p`
  margin: 0 0 0.35rem;
  font-size: 0.85rem;
  font-weight: 700;
`;

const Field = styled.div`
  margin: 0.7rem 0 0;
  color: ${(p) => p.theme.heading};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Value = styled.span`
  float: right;
  color: ${(p) => p.theme.red};
  letter-spacing: 0;
  text-transform: none;
`;

const Range = styled.input`
  width: 100%;
  margin-top: 0.35rem;
  accent-color: ${(p) => p.theme.red};
`;

const Choices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.35rem;
`;

const Choice = styled.button`
  padding: 0.28rem 0.45rem;
  border: 1px solid ${(p) => p.theme.line};
  background: ${(p) => (p.$on ? p.theme.red : '#ffffff')};
  color: ${(p) => (p.$on ? '#ffffff' : p.theme.heading)};
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
`;

function labelFor(value) {
  if (value === 'none') {
    return 'None';
  }
  return value[0].toUpperCase() + value.slice(1);
}

function noteLeft(x, y, text) {
  return (
    <g key={text}>
      <line
        x1="4"
        x2={x}
        y1={y}
        y2={y}
        stroke="#1c1c1c"
        strokeWidth="0.6"
      />
      <text
        x="6"
        y={y - 3}
        fontSize="8"
        fill="#414042"
      >
        {text}
      </text>
    </g>
  );
}

const HEAT = '#cc0633';
const DRY = '#245c96';

function arrowMark(x1, x2, y, color, dashed) {
  const dir = x2 >= x1 ? 1 : -1;
  const tip = x2;
  const base = x2 - dir * 6;
  const points = [
    tip + ',' + y,
    base + ',' + (y - 3.1),
    base + ',' + (y + 3.1),
  ].join(' ');

  return (
    <g>
      <line
        x1={x1}
        x2={base}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth="1.45"
        strokeDasharray={dashed ? '2.5 2' : undefined}
      />
      <polygon points={points} fill={color} />
    </g>
  );
}

function stopBar(x, y, color) {
  return (
    <line
      x1={x}
      x2={x}
      y1={y - 7}
      y2={y + 7}
      stroke={color}
      strokeWidth="1.7"
    />
  );
}

function flowMarks(spec) {
  const mid = spec.cavityX + spec.cavity * 0.42;
  const marks = [];

  if (spec.heatDir === 'out') {
    marks.push(
      <g key="heat">
        {arrowMark(
          spec.gypX + 2,
          spec.outer - 2,
          spec.heatY,
          HEAT,
          false,
        )}
      </g>,
    );
  }
  if (spec.heatDir === 'in') {
    marks.push(
      <g key="heat">
        {arrowMark(
          spec.outer - 2,
          spec.gypX + 2,
          spec.heatY,
          HEAT,
          false,
        )}
      </g>,
    );
  }
  if (spec.dryDir === 'out') {
    marks.push(
      <g key="dry">
        {arrowMark(mid, spec.outer + 12, spec.dryY, DRY, false)}
      </g>,
    );
  }
  if (spec.dryDir === 'slow') {
    marks.push(
      <g key="dry-in">
        {arrowMark(
          spec.outer - 2,
          spec.polyX + 3,
          spec.dryY,
          DRY,
          true,
        )}
        {stopBar(spec.polyX + 1, spec.dryY, DRY)}
      </g>,
    );
    marks.push(
      <g key="dry-out">
        {arrowMark(
          mid,
          spec.outer + 12,
          spec.dryY + 16,
          DRY,
          true,
        )}
      </g>,
    );
  }
  if (spec.dryDir === 'blocked') {
    marks.push(
      <g key="dry-enter">
        {arrowMark(spec.gypX - 10, mid, spec.dryY, DRY, false)}
      </g>,
    );
    marks.push(
      <g key="dry-stop">
        {arrowMark(
          mid,
          spec.membraneX - 2,
          spec.dryY + 16,
          DRY,
          false,
        )}
        {stopBar(spec.membraneX, spec.dryY + 16, DRY)}
      </g>,
    );
  }
  if (spec.dryDir === 'closed') {
    marks.push(
      <g key="dry-stop">
        {stopBar(spec.membraneX, spec.dryY, DRY)}
      </g>,
    );
  }
  if (spec.dryDir === 'inward') {
    marks.push(
      <g key="dry">
        {arrowMark(mid, spec.gypX - 10, spec.dryY, DRY, false)}
        {spec.moisture === 'impermeable'
          ? stopBar(spec.membraneX, spec.dryY, DRY)
          : null}
      </g>,
    );
  }
  if (spec.dryDir === 'enter') {
    marks.push(
      <g key="dry-enter">
        {arrowMark(spec.gypX - 10, mid, spec.dryY, DRY, false)}
      </g>,
    );
    marks.push(
      <g key="dry-leave">
        {arrowMark(
          mid,
          spec.outer + 12,
          spec.dryY + 16,
          DRY,
          true,
        )}
      </g>,
    );
  }
  if (spec.dryDir === 'trapped') {
    marks.push(
      <g key="dry-out">
        {arrowMark(
          mid,
          spec.membraneX - 2,
          spec.dryY,
          DRY,
          false,
        )}
        {stopBar(spec.membraneX, spec.dryY, DRY)}
      </g>,
    );
    marks.push(
      <g key="dry-in">
        {arrowMark(
          mid,
          spec.polyX + 3,
          spec.dryY + 16,
          DRY,
          false,
        )}
        {stopBar(spec.polyX + 1, spec.dryY + 16, DRY)}
      </g>,
    );
  }
  if (spec.dryDir === 'rain') {
    marks.push(
      <g key="dry">
        {arrowMark(spec.outer + 12, mid, spec.dryY, DRY, false)}
      </g>,
    );
  }

  return marks;
}

function noteRight(x, y, text) {
  return (
    <g key={text}>
      <line
        x1={x}
        x2={x + 16}
        y1={y}
        y2={y}
        stroke="#1c1c1c"
        strokeWidth="0.6"
      />
      <text
        x={x + 18}
        y={y + 3}
        fontSize="8"
        fill="#414042"
      >
        {text}
      </text>
    </g>
  );
}

function WallSection({
  insulation,
  moisture,
  vapor,
  wetness,
  heatDir,
  dryDir,
}) {
  const top = 22;
  const height = 168;
  const siding = 11;
  const air = moisture === 'permeable' ? 6 : 2;
  const membrane = moisture === 'impermeable' ? 4 : 0;
  const sheath = 7;
  const cavity = cavityDepth[insulation];
  const poly = vapor ? 2 : 0;
  const gyp = 8;
  const left = 78;
  const gypX = left;
  const polyX = gypX + gyp;
  const cavityX = polyX + poly;
  const sheathX = cavityX + cavity;
  const membraneX = sheathX + sheath;
  const sidingX = membraneX + membrane + air;
  const outer = sidingX + siding;
  const wet = Math.max(0, Math.min(1, wetness));
  const moistureName = moisture === 'permeable'
    ? 'Wrap'
    : 'Membrane';

  return (
    <Sheet
      viewBox="0 0 250 230"
      role="img"
      aria-label="Vertical section through a wood-frame wall"
    >
      <defs>
        <pattern
          id="batt"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-2 2 L2 -2 M0 0 L8 8 M6 10 L10 6"
            stroke="#5a5144"
            strokeWidth="0.75"
          />
          <path
            d="M-2 6 L2 10 M0 8 L8 0 M6 -2 L10 2"
            stroke="#5a5144"
            strokeWidth="0.75"
          />
        </pattern>
      </defs>
      <rect
        x={gypX - 6}
        y={top + height}
        width={outer - gypX + 14}
        height="16"
        fill="#cfcfcf"
        stroke="#1c1c1c"
        strokeWidth="1.2"
      />
      <rect
        x={gypX}
        y={top}
        width={gyp}
        height={height}
        fill="#f7f7f7"
        stroke="#1c1c1c"
        strokeWidth="1.2"
      />
      {vapor ? (
        <line
          x1={polyX + 1}
          x2={polyX + 1}
          y1={top}
          y2={top + height}
          stroke="#1c1c1c"
          strokeWidth="2"
        />
      ) : null}
      <rect
        x={cavityX}
        y={top}
        width={cavity}
        height="9"
        fill="#e7d3a8"
        stroke="#1c1c1c"
        strokeWidth="0.9"
      />
      <rect
        x={cavityX}
        y={top + height - 9}
        width={cavity}
        height="9"
        fill="#e7d3a8"
        stroke="#1c1c1c"
        strokeWidth="0.9"
      />
      <rect
        x={cavityX}
        y={top + 9}
        width={cavity}
        height={height - 18}
        fill="#f4ecd4"
        stroke="#1c1c1c"
        strokeWidth="0.8"
      />
      <rect
        x={cavityX}
        y={top + 9}
        width={cavity}
        height={height - 18}
        fill="url(#batt)"
      />
      <rect
        x={cavityX}
        y={top + 9}
        width={cavity}
        height={height - 18}
        fill={'rgba(36, 92, 150, ' + (wet * 0.4).toFixed(2) + ')'}
      />
      <rect
        x={sheathX}
        y={top}
        width={sheath}
        height={height}
        fill="#f3ead7"
        stroke="#1c1c1c"
        strokeWidth="1"
      />
      {moisture === 'impermeable' ? (
        <rect
          x={membraneX}
          y={top}
          width={membrane}
          height={height}
          fill="#1c1c1c"
        />
      ) : null}
      {moisture === 'permeable' ? (
        <line
          x1={sidingX - 2}
          x2={sidingX - 2}
          y1={top}
          y2={top + height}
          stroke="#1c1c1c"
          strokeWidth="1.2"
          strokeDasharray="3 2"
        />
      ) : null}
      <rect
        x={sidingX}
        y={top}
        width={siding}
        height={height}
        fill="#e4d2b0"
        stroke="#1c1c1c"
        strokeWidth="1.1"
      />
      {[36, 72, 108, 144].map((offset) => (
        <line
          key={offset}
          x1={sidingX}
          x2={sidingX + siding}
          y1={top + offset}
          y2={top + offset}
          stroke="#1c1c1c"
          strokeWidth="0.6"
        />
      ))}
      {flowMarks({
        heatDir,
        dryDir,
        heatY: top + 50,
        dryY: top + 104,
        gypX,
        polyX,
        cavityX,
        cavity,
        membraneX,
        outer,
        moisture,
      })}
      {noteLeft(gypX, top + 28, 'Gypsum')}
      {noteLeft(cavityX, top + 78, 'Insulation')}
      {vapor
        ? noteLeft(polyX, top + 150, 'Vapor barrier')
        : null}
      {noteRight(sidingX + siding, top + 28, 'Siding')}
      {noteRight(sheathX + sheath, top + 72, 'Sheathing')}
      {moisture !== 'none'
        ? noteRight(
          membraneX + Math.max(membrane, 1),
          top + 138,
          moistureName,
        )
        : null}
    </Sheet>
  );
}

/** Wall section under the news column. */
export default function WallBench() {
  const [tempOut, setTempOut] = useState(-5);
  const [insulation, setInsulation] = useState('typical');
  const [rain, setRain] = useState(true);
  const [vaporBarrier, setVaporBarrier] = useState(true);
  const [moistureBarrier, setMoistureBarrier] = useState(
    'permeable',
  );
  const state = wallState({
    tempOut,
    insulation,
    rain,
    vaporBarrier,
    moistureBarrier,
  });

  return (
    <Bench>
      <Title>Try a wall</Title>
      <Note>
        An illustration, not a measured wall. Indoor air
        stays at 20°C.
      </Note>
      <WallSection
        insulation={insulation}
        moisture={moistureBarrier}
        vapor={vaporBarrier}
        wetness={state.wetness}
        heatDir={state.heatDir}
        dryDir={state.dryDir}
      />
      <Readout>
        {state.heatLabel}
        {'. '}
        {state.moistureLabel}
        .
      </Readout>
      <Field as="label">
        Outdoor
        <Value>{tempOut}°C</Value>
        <Range
          type="range"
          min="-10"
          max="35"
          step="1"
          value={tempOut}
          onChange={(event) => {
            setTempOut(Number(event.target.value));
          }}
        />
      </Field>
      <Field>
        Insulation
        <Choices>
          {['thin', 'typical', 'thick'].map((value) => (
            <Choice
              key={value}
              type="button"
              $on={insulation === value}
              aria-pressed={insulation === value}
              onClick={() => setInsulation(value)}
            >
              {labelFor(value)}
            </Choice>
          ))}
        </Choices>
      </Field>
      <Field>
        Rain
        <Choices>
          <Choice
            type="button"
            $on={rain}
            aria-pressed={rain}
            onClick={() => setRain(true)}
          >
            On
          </Choice>
          <Choice
            type="button"
            $on={!rain}
            aria-pressed={!rain}
            onClick={() => setRain(false)}
          >
            Off
          </Choice>
        </Choices>
      </Field>
      <Field>
        Vapor barrier
        <Choices>
          <Choice
            type="button"
            $on={vaporBarrier}
            aria-pressed={vaporBarrier}
            onClick={() => setVaporBarrier(true)}
          >
            On
          </Choice>
          <Choice
            type="button"
            $on={!vaporBarrier}
            aria-pressed={!vaporBarrier}
            onClick={() => setVaporBarrier(false)}
          >
            Off
          </Choice>
        </Choices>
      </Field>
      <Field>
        Moisture barrier
        <Choices>
          {['none', 'permeable', 'impermeable'].map((value) => (
            <Choice
              key={value}
              type="button"
              $on={moistureBarrier === value}
              aria-pressed={moistureBarrier === value}
              onClick={() => setMoistureBarrier(value)}
            >
              {labelFor(value)}
            </Choice>
          ))}
        </Choices>
      </Field>
    </Bench>
  );
}
