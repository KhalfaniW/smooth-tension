import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";

export function InternalValuesPage() {
  return (
    <>
      <h1>Values</h1>
      <ValueChartWithHighlight
        barNamesAndValues={[
          {name: "Reddit", value: 1},
          {name: "Youtube", value: 2},
          {name: "Calmness", value: 6},
          {name: "Health", value: 8},
          {name: "Value Creation", value: 7},
        ]}
        nameToHighlight="Calmness"
      />
    </>
  );
}

export default function ValueChart({barNamesAndValues}) {
  return (
    <ValueChartWithHighlight
      barNamesAndValues={barNamesAndValues}
      nameToHighlight={"RANDOM_NAME_THAT_SHOULD_NEVER_EXISTS_JH3DJsfiewja"}
    />
  );
}

export function ValueChartWithHighlight({barNamesAndValues, nameToHighlight}) {
  const BLUE = "#0000ff";
  const BLACK = "#000000";
  const LIGHT_GREEN = "#00ff00";
  const DARK_GREEN = "#00994C";
  const barChart = (
    <div>
      <BarChart width={600} height={300} data={barNamesAndValues}>
        <XAxis dataKey="name" stroke="#8884d8" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        {/* <Bar dataKey="value" fill= barSize={30} /> */}
        <Bar dataKey="value">
          {barNamesAndValues.map((entry, index) => {
            if (entry.name === nameToHighlight) {
              return <Cell key={`cell-${index}`} fill={DARK_GREEN} />;
            }
            return <Cell key={`cell-${index}`} fill={BLUE} />;
          })}
        </Bar>
      </BarChart>
    </div>
  );
  return barChart;
}
