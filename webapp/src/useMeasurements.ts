import { GraphQLResult } from '@aws-amplify/api-graphql';
import { AWSIoTProvider, PubSub } from '@aws-amplify/pubsub';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { useState, useEffect, useCallback } from 'react';

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

  // timestamp の範囲を指定して取得
  const requestMeasurements = useCallback(async (from: number, to: number) => {
    const { data } = (await API.graphql(
      graphqlOperation(queries.listMeasurements, {
        type: 'Measurement',
        timestamp: {
          between: [from, to],
        },
        limit: 500,
      } as ListMeasurementsQueryVariables)
    )) as GraphQLResult<ListMeasurementsQuery>;

    setMeasurements(
      (data?.listMeasurements?.items?.filter(
        Boolean
      ) as readonly Measurement[]) ?? []
    );
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
