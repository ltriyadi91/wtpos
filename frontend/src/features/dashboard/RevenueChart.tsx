import { Box, Button, Card } from "@mantine/core";
import React, { useEffect, useState } from "react";

import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  ReferenceArea,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type LineItem = {
  dataKey: string;
  stroke: string;
  name: string;
  tooltipString: string;
};

export const line: LineItem = {
  dataKey: "revenue",
  stroke: "#4287f5",
  name: "Revenue",
  tooltipString: "Revenue",
};

export const getYAxisMinMax = (data: RevenueData[]) => {
  if (data?.length) {
    let [bottom, top] = [0, 0];

    const key = line.dataKey;
    const values = data.map((e) => {
      const value = e[key as keyof RevenueData];
      return typeof value === "number" ? value : Number(value) || 0;
    });

    const currentTop = Math.max(...values);
    const currentBottom = Math.min(...values);

    if (currentTop > top) top = currentTop;
    if (currentBottom < bottom) bottom = currentBottom;

    return [bottom, top];
  }

  return [0, 0];
};

type RevenueData = {
  date: string;
  revenue: number;
};

const Chart = ({ data }: { data: RevenueData[] }) => {
  const [yDomainTop, setYDomainTop] = useState(10);
  const [yDomainBottom, setYDomainBottom] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [visibleData, setVisibleData] = useState(data);
  const [xDomainLeft, setXDomainLeft] = useState("");
  const [xDomainRight, setXDomainRight] = useState("");

  useEffect(() => {
    setVisibleData(data);
  }, [data]);

  const getAxisYDomain = (from: string, to: string) => {
    let reverseOrder = false;
    const dataKeys = data.map((e) => e.date);
    let fromIndex = dataKeys.indexOf(from);
    let toIndex = dataKeys.indexOf(to);

    if (fromIndex > toIndex) {
      const fromIndexCopy = fromIndex;
      fromIndex = toIndex;
      toIndex = fromIndexCopy;

      reverseOrder = true;
    }

    const filteredData = data.slice(fromIndex, toIndex + 1);
    setVisibleData(filteredData);

    return {
      range: getYAxisMinMax(data),
      reverseOrder,
    };
  };

  const zoomIn = () => {
    if (xDomainLeft === xDomainRight || xDomainRight === "") {
      setXDomainLeft("");
      setXDomainRight("");
      return;
    }

    let _xDomainLeft = xDomainLeft;
    let _xDomainRight = xDomainRight;

    const { range, reverseOrder } = getAxisYDomain(_xDomainLeft, _xDomainRight);
    const [bottomPoint, topPoint] = range;

    if (reverseOrder) {
      const xDomainLeftCopy = _xDomainLeft;
      _xDomainLeft = _xDomainRight;
      _xDomainRight = xDomainLeftCopy;
    }

    setIsZoomed(true);
    setXDomainLeft("");
    setXDomainRight("");
    setYDomainBottom(Number(bottomPoint));
    setYDomainTop(Number(topPoint));
  };

  const zoomOut = () => {
    setIsZoomed(false);
    setVisibleData(data);
    setXDomainLeft("");
    setXDomainRight("");
    setYDomainBottom(Number(getYAxisMinMax(data)[0]));
    setYDomainTop(Number(getYAxisMinMax(data)[1]));
  };

  return (
    <Card
      className="lineChart"
      shadow="md"
      withBorder
      p="xl"
      radius="md"
      mt="md"
      style={{ userSelect: "none" }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={visibleData}
          onMouseUp={zoomIn}
          onMouseDown={(nextState) =>
            setXDomainLeft(nextState?.activeLabel || "")
          }
          onMouseMove={(nextState) =>
            xDomainLeft && setXDomainRight(nextState?.activeLabel || "")
          }
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            strokeOpacity={1}
            allowDataOverflow
            tick={{ fill: "#6b6f81" }}
            tickLine={{ stroke: "#6b6f81" }}
            axisLine={{ stroke: "#6b6f81", strokeOpacity: 1 }}
          />

          <YAxis
            dataKey="revenue"
            type="number"
            allowDataOverflow
            tick={{ fill: "#6b6f81" }}
          />

          <Tooltip />
          <Line
            yAxisId="1"
            dot
            strokeWidth={2}
            animationDuration={300}
            dataKey="revenue"
            stroke="#4287f5"
          />

          {xDomainLeft && xDomainRight ? (
            <ReferenceArea
              yAxisId="1"
              opacity={1}
              x1={xDomainLeft}
              x2={xDomainRight}
              fill="#006dd9"
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
      <Box mt="md">
        {isZoomed ? <Button onClick={zoomOut}>Zoom out</Button> : null}
      </Box>
    </Card>
  );
};

export default Chart;
