import React, { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';

import awsExports from './aws-exports';
import * as queries from './graphql/queries';
import { ListMeasurementsQuery, Measurement } from './api';
import './App.css';
import Charts from './Charts';

Amplify.configure(awsExports);

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
      <Charts measurements={measurements} />
    </div>
  );
};

export default App;
