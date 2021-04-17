import React, { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import jaLocale from 'apexcharts/dist/locales/ja.json';

import awsExports from './aws-exports';
import * as queries from './graphql/queries';
import { ListMeasurementsQuery, Measurement } from './api';
import './App.css';

Amplify.configure(awsExports);

const chartHeight = 400;

const commonApexOptions: ApexOptions = {
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

const App: React.FC = () => {
  const [measurements, setMeasurements] = useState<readonly Measurement[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = (await API.graphql(
        graphqlOperation(queries.listMeasurements)
      )) as GraphQLResult<ListMeasurementsQuery>;

      setMeasurements(
        (data?.listMeasurements?.items?.filter(
          Boolean
        ) as readonly Measurement[]) ?? []
      );
    })();
  }, []);

  return (
    <div className="App">
      <Chart
        options={{
          ...commonApexOptions,
          chart: {
            ...commonApexOptions.chart,
            id: 'temperature-chart',
          },
          yaxis: {
            ...commonApexOptions.yaxis,
            title: {
              text: '温度 [℃]',
            },
          },
        }}
        series={[
          {
            name: 'temperature',
            data: measurements.map((m) => [m.timestamp, m.temperature]),
          },
        ]}
        height={chartHeight}
      />
      <Chart
        options={{
          ...commonApexOptions,
          chart: {
            ...commonApexOptions.chart,
            id: 'humidity-chart',
          },
          yaxis: {
            ...commonApexOptions.yaxis,
            title: {
              text: '湿度 [%]',
            },
          },
        }}
        series={[
          {
            name: 'humidity',
            data: measurements.map((m) => [m.timestamp, m.humidity]),
          },
        ]}
        height={chartHeight}
      />
    </div>
  );
};

export default App;
