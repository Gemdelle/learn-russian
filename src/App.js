import { useState } from 'react';
import Header from './components/Header/Header';
import Reading from './components/Reading/Reading';
import Stories from './components/Stories/Stories';
import Dictionary from './components/Dictionary/Dictionary';
import './App.scss';

function App() {
  const [tab, setTab] = useState('reading');

  return (
    <div className="App">
      <Header activeTab={tab} onTabChange={setTab} />
      {tab === 'stories' && <Stories />}
      {tab === 'reading' && <Reading />}
      {tab === 'dictionary' && <Dictionary />}
    </div>
  );
}

export default App;
