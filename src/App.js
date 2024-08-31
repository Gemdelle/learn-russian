import './App.css';
import Header from './components/Header/Header';
import Keyboard from './components/Keyboard/Keyboard';
import Dictionary from "./components/Dicctionary/Dictionary";
import Karaoke from "./components/Karaoke/Karaoke";
import BookSelection from "./components/BookSelection/BookSelection";

function App() {
  return (
    <div className="App">
      <Header />
      <BookSelection selectedLanguaje="RU"/>
    </div>
  );
}

export default App;
