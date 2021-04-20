import { GraphQLResult } from '@aws-amplify/api-graphql';
import { API, graphqlOperation } from 'aws-amplify';
import { sub } from 'date-fns';
import { useState, useEffect } from 'react';

import * as queries from './graphql/queries';
import {
  Measurement,
  ListMeasurementsQueryVariables,
  ListMeasurementsQuery,
} from './api';

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

  return measurements;
};
