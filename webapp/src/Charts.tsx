import React, { useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts, { ApexOptions } from 'apexcharts';
import jaLocale from 'apexcharts/dist/locales/ja.json';
import { sub } from 'date-fns';

import { Measurement } from './api';
import './Charts.css';
import { useMeasurements } from './useMeasurements';

const initialXRange = { days: 1, hours: 1 };

const chartHeight = '40%';

const chartIds = ['temperature-chart', 'humidity-chart'] as const;

const clientIdToRoom = {
  'esp8266-white': 'ダイニング',
  'esp8266-blue': '洋室',
  'esp8266-yellow': '納戸',
};

const getCommonOptions = (
  requestMeasurements: (from: number, to: number) => Promise<void>
): ApexOptions => ({
  chart: {
    group: 'chart-group',
    height: chartHeight,
    locales: [jaLocale],
    defaultLocale: 'ja',
    animations: {
      easing: 'easeinout',
      animateGradually: {
        enabled: false,
      },
      dynamicAnimation: {
        speed: 100,
      },
    },
    events: {
      // legend クリックによる series の表示・非表示を、2 つの chart 間で連動させる
      legendClick: (chartContext, seriesIndex) => {
        if (seriesIndex === undefined) return;

        const clickedChartId: typeof chartIds[number] =
          chartContext.opts.chart.id;
        ApexCharts.exec(
          chartIds[1 - chartIds.indexOf(clickedChartId)],
          'toggleSeries',
          Object.values(clientIdToRoom)[seriesIndex]
        );
      },
      // ズームアウトするときの範囲を制限する
      beforeZoom: (_, { xaxis }) => {
        const now = new Date();
        return {
          xaxis: {
            min: Math.max(xaxis.min, sub(now, { days: 3 }).getTime()),
            max: Math.min(xaxis.max, now.getTime()),
          },
        };
      },
      // 最初のズーム範囲に戻す
      beforeResetZoom: () => {
        const now = new Date();
        return {
          xaxis: {
            min: sub(now, initialXRange).getTime(),
            max: now.getTime(),
          },
        };
      },
      // 読み込んでいない範囲があれば読み込む
      zoomed: (_, { xaxis }) => {
        if (xaxis.min === undefined || xaxis.max === undefined) return; // ズームリセットのとき
        requestMeasurements(xaxis.min, xaxis.max);
      },
      scrolled: (_, { xaxis }) => {
        requestMeasurements(xaxis.min, xaxis.max);
      },
    },
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
});

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

const Charts: React.FC = () => {
  const { measurements, requestMeasurements } = useMeasurements();

  useEffect(() => {
    const now = new Date();
    requestMeasurements(sub(now, initialXRange).getTime(), now.getTime());
  }, [requestMeasurements]);

  const commonOptions = useMemo(() => getCommonOptions(requestMeasurements), [
    requestMeasurements,
  ]);

  // FIXME: subscription によって新しいデータが追加されると、
  // 全データが表示される範囲に x 軸のズームがリセットされてしまう
  // https://github.com/apexcharts/react-apexcharts/issues/148

  return (
    <>
      <Chart
        className="Chart"
        options={{
          ...commonOptions,
          chart: {
            ...commonOptions.chart,
            id: chartIds[0],
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
            id: chartIds[1],
          },
          yaxis: {
            ...commonOptions.yaxis,
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
