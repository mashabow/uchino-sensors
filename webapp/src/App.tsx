import React, { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';

import awsExports from './aws-exports';
import * as queries from './graphql/queries';
import { ListMeasurementsQuery, Measurement } from './api';
import './App.css';
import Charts from './Charts';
import GitHubMark from './github-mark.svg';

Amplify.configure(awsExports);

const App: React.FC = () => {
  const [measurements, setMeasurements] = useState<readonly Measurement[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = (await API.graphql(
        graphqlOperation(queries.listMeasurements, { limit: 500 })
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
      <header>
        <h1 className="Title">uchino-sensors</h1>
        <a
          className="GitHubLink"
          href="https://github.com/mashabow/uchino-sensors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={GitHubMark}
            alt="GitHub リポジトリへ"
            width="18"
            height="18"
          />
        </a>
      </header>
      <Charts measurements={measurements} />
    </div>
  );
};

export default App;
