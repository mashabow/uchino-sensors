import { GraphQLResult } from '@aws-amplify/api-graphql';
import { AWSIoTProvider, PubSub } from '@aws-amplify/pubsub';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { sub } from 'date-fns';
import { useState, useEffect } from 'react';

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

export const useMeasurements = (): readonly Measurement[] => {
  const [measurements, setMeasurements] = useState<readonly Measurement[]>([]);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const { data } = (await API.graphql(
        graphqlOperation(queries.listMeasurements, {
          type: 'Measurement',
          timestamp: {
            between: [sub(now, { days: 1, hours: 1 }).getTime(), now.getTime()],
          },
          limit: 500,
        } as ListMeasurementsQueryVariables)
      )) as GraphQLResult<ListMeasurementsQuery>;

      setMeasurements(
        (data?.listMeasurements?.items?.filter(
          Boolean
        ) as readonly Measurement[]) ?? []
      );
    })();
  }, []);

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

  return measurements;
};
