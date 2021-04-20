import React from 'react';

import './App.css';
import Charts from './Charts';
import GitHubMark from './github-mark.svg';

const App: React.FC = () => {
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
      <Charts />
    </div>
  );
};

export default App;
