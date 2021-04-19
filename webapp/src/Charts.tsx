import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import jaLocale from 'apexcharts/dist/locales/ja.json';

import { Measurement } from './api';
import './Chart.css';

const chartHeight = 380;

const commonOptions: ApexOptions = {
  chart: {
    id: 'temperature-chart',
    group: 'chart-group',
    height: chartHeight,
    locales: [jaLocale],
    defaultLocale: 'ja',
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  xaxis: {
    type: 'datetime',
    title: {
      text: '日時',
      offsetY: 3,
    },
    labels: {
      datetimeFormatter: {
        year: 'yyyy年',
        month: 'yyyy年M月',
        day: 'M月d日',
      },
      datetimeUTC: false, // ローカルのタイムゾーンで表示する
    },
  },
  yaxis: {
    labels: {
      minWidth: 30,
    },
    decimalsInFloat: 0,
  },
  tooltip: {
    x: {
      format: 'yyyy年M月d日(ddd) HH:mm',
    },
  },
  legend: {
    // 右のツールバーと上下位置を揃える
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 13,
    offsetY: -1,
    markers: {
      width: 10,
      height: 10,
    },
  },
};

const clientIdToRoom = {
  'esp8266-white': 'ダイニング',
  'esp8266-blue': '洋室',
  'esp8266-yellow': '納戸',
};

const getSeries = (
  measurements: readonly Measurement[],
  field: 'temperature' | 'humidity'
) =>
  Object.entries(clientIdToRoom).map(([clientId, room]) => ({
    name: room,
    data: measurements
      .filter((m) => m.clientId === clientId)
      .map((m) => [m.timestamp, m[field]]),
  }));

interface Props {
  readonly measurements: readonly Measurement[];
}

const Charts: React.FC<Props> = ({ measurements }) => {
  return (
    <>
      <Chart
        className="Chart"
        options={{
          ...commonOptions,
          chart: {
            ...commonOptions.chart,
            id: 'temperature-chart',
          },
          yaxis: {
            ...commonOptions.yaxis,
            title: {
              text: '温度 [°C]',
            },
          },
          tooltip: {
            ...commonOptions.tooltip,
            y: {
              formatter: (value) => `${value.toFixed(1)} °C`,
            },
          },
        }}
        series={getSeries(measurements, 'temperature')}
        height={chartHeight}
      />
      <Chart
        className="Chart"
        options={{
          ...commonOptions,
          chart: {
            ...commonOptions.chart,
            id: 'humidity-chart',
          },
          yaxis: {
            ...commonOptions.yaxis,
            min: 50,
            max: 80,
            tickAmount: 6,
            title: {
              text: '湿度 [%]',
            },
          },
          tooltip: {
            ...commonOptions.tooltip,
            y: {
              formatter: (value) => `${value} %`,
            },
          },
        }}
        series={getSeries(measurements, 'humidity')}
        height={chartHeight}
      />
    </>
  );
};

export default Charts;
