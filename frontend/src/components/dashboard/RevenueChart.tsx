"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { Button, Card } from "@mantine/core";

export interface RevenueData {
  date: string;
  revenue: number;
}

interface ChartState {
  data: RevenueData[];
  left: string | number;
  right: string | number;
  refAreaLeft: string | number;
  refAreaRight: string | number;
  top: string | number;
  bottom: string | number;
  animation: boolean;
}

const initialState: ChartState = {
  data: [],
  left: "dataMin",
  right: "dataMax",
  refAreaLeft: "",
  refAreaRight: "",
  top: "dataMax+1",
  bottom: "dataMin-1",
  animation: true,
};

const getAxisYDomain = (
  data: RevenueData[],
  from: string,
  to: string,
  ref: keyof RevenueData,
  offset: number
) => {
  const fromIndex = data.findIndex((d) => d.date === from);
  const toIndex = data.findIndex((d) => d.date === to);
  const refData = data.slice(fromIndex, toIndex + 1);

  if (refData.length === 0) return [0, 0];

  let bottom = refData[0][ref] as number;
  let top = refData[0][ref] as number;

  refData.forEach((d) => {
    const val = d[ref] as number;
    if (val > top) top = val;
    if (val < bottom) bottom = val;
  });

  return [Math.floor(bottom) - offset, Math.ceil(top) + offset];
};

interface RevenueChartProps {
  data: RevenueData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data: initialData }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState((prevState) => ({ ...prevState, data: initialData }));
  }, [initialData]);

  const zoom = () => {
    let { refAreaLeft, refAreaRight } = state;
    const { data } = state;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setState((prevState) => ({
        ...prevState,
        refAreaLeft: "",
        refAreaRight: "",
      }));
      return;
    }

    if (refAreaLeft > refAreaRight) {
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
    }

    const [bottom, top] = getAxisYDomain(
      data,
      refAreaLeft as string,
      refAreaRight as string,
      "revenue",
      10
    );

    setState((prevState) => ({
      ...prevState,
      data: data.slice(),
      refAreaLeft: "",
      refAreaRight: "",
      left: refAreaLeft,
      right: refAreaRight,
      bottom: bottom,
      top: top,
    }));
  };

  const zoomOut = () => {
    setState((prevState) => ({
      ...prevState,
      refAreaLeft: "",
      refAreaRight: "",
      left: "dataMin",
      right: "dataMax",
      top: "dataMax+10",
      bottom: "dataMin-10",
    }));
  };

  const { data, refAreaLeft, refAreaRight, left, right, top, bottom } = state;

  return (
    <Card withBorder shadow="sm" radius="md" p="lg" mt="md" style={{ userSelect: 'none', width: '100%' }}>
      <Button onClick={zoomOut} variant="outline" size="xs" mb="md">
        Zoom Out
      </Button>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          onMouseDown={(e) =>
            e && setState((prevState) => ({ ...prevState, refAreaLeft: e.activeLabel as string }))
          }
          onMouseMove={(e) =>
            state.refAreaLeft &&
            e &&
            setState((prevState) => ({ ...prevState, refAreaRight: e.activeLabel as string }))
          }
          onMouseUp={zoom}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDataOverflow domain={[left, right]} />
          <YAxis
            allowDataOverflow
            domain={[bottom, top]}
            type="number"
            yAxisId="1"
          />
          <Tooltip />
          <Line
            yAxisId="1"
            type="natural"
            dataKey="revenue"
            stroke="#8884d8"
            animationDuration={300}
          />

          {refAreaLeft && refAreaRight ? (
            <ReferenceArea
              yAxisId="1"
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart;
