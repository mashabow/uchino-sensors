import { GraphQLResult } from '@aws-amplify/api-graphql';
import { AWSIoTProvider, PubSub } from '@aws-amplify/pubsub';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { useState, useEffect, useCallback, useRef } from 'react';

import awsExports from './aws-exports';
import * as queries from './graphql/queries';
import {
  Measurement,
  ListMeasurementsQueryVariables,
  ListMeasurementsQuery,
} from './api';

Amplify.configure({
  ...awsExports,
  // PubSub で必要になる Cognito の ID プールを指定
  Auth: {
    region: awsExports.aws_project_region,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
});

Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: awsExports.aws_project_region,
    aws_pubsub_endpoint: process.env.REACT_APP_PUBSUB_ENDPOINT,
  })
);

export const useMeasurements = (): {
  measurements: readonly Measurement[];
  requestMeasurements: (from: number, to: number) => Promise<void>;
} => {
  const [measurements, setMeasurements] = useState<readonly Measurement[]>([]);
  const timestampMin = useRef(Date.now());

  // timestamp の範囲を指定して取得
  const requestMeasurements = useCallback(async (from: number, to: number) => {
    if (from >= timestampMin.current) return;

    const { data } = (await API.graphql(
      graphqlOperation(queries.listMeasurements, {
        type: 'Measurement',
        timestamp: { between: [from, timestampMin.current] },
        limit: 500,
      } as ListMeasurementsQueryVariables)
    )) as GraphQLResult<ListMeasurementsQuery>;

    setMeasurements((ms) =>
      [
        ...ms,
        ...((data?.listMeasurements?.items?.filter(
          Boolean
        ) as readonly Measurement[]) ?? []),
      ].sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
    );
    timestampMin.current = from;
  }, []);

  // リアルタイム更新
  useEffect(() => {
    const subscription = PubSub.subscribe(
      'republished/with-uchino-sensors-fields'
    ).subscribe({
      next: ({ value: measurement }: { readonly value: Measurement }) =>
        setMeasurements((measurements) => [...measurements, measurement]),
      error: (error) => console.warn(error),
    });
    return () => subscription.unsubscribe();
  }, []);

  return { measurements, requestMeasurements };
};
