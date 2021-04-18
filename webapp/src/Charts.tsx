import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import jaLocale from 'apexcharts/dist/locales/ja.json';
import { Measurement } from './api';

const chartHeight = 400;

const commonOptions: ApexOptions = {
  chart: {
    id: 'temperature-chart',
    group: 'chart-group',
    height: chartHeight,
    locales: [jaLocale],
    defaultLocale: 'ja',
  },
  xaxis: {
    type: 'datetime',
    title: {
      text: '日時',
    },
    labels: {
      datetimeUTC: false, // ローカルのタイムゾーンで表示する
    },
  },
  yaxis: {
    labels: {
      minWidth: 50,
    },
  },
};

const clientIdToRoom = {
  'esp8266-white': 'ダイニング',
  'esp8266-blue': '洋室',
  'esp8266-yellow': '納戸',
};

interface Props {
  readonly measurements: readonly Measurement[];
}

const Charts: React.FC<Props> = ({ measurements }) => {
  return (
    <>
      <Chart
        options={{
          ...commonOptions,
          chart: {
            ...commonOptions.chart,
            id: 'temperature-chart',
          },
          yaxis: {
            ...commonOptions.yaxis,
            title: {
              text: '温度 [℃]',
            },
          },
        }}
        series={Object.entries(clientIdToRoom).map(([clientId, room]) => ({
          name: room,
          data: measurements
            .filter((m) => m.clientId === clientId)
            .map((m) => [m.timestamp, m.temperature]),
        }))}
        height={chartHeight}
      />
      <Chart
        options={{
          ...commonOptions,
          chart: {
            ...commonOptions.chart,
            id: 'humidity-chart',
          },
          yaxis: {
            ...commonOptions.yaxis,
            title: {
              text: '湿度 [%]',
            },
          },
        }}
        series={Object.entries(clientIdToRoom).map(([clientId, room]) => ({
          name: room,
          data: measurements
            .filter((m) => m.clientId === clientId)
            .map((m) => [m.timestamp, m.humidity]),
        }))}
        height={chartHeight}
      />
    </>
  );
};

export default Charts;
