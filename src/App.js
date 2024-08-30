import './App.css';
import Header from './components/Header/Header';
import Keyboard from './components/Keyboard/Keyboard';
import Dictionary from "./components/Dicctionary/Dictionary";

function App() {
  return (
    <div className="App">
      <Header />
      <Keyboard selectedLanguaje="RU"/>
    </div>
  );
}

export default App;
