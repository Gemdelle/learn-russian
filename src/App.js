import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { LocalizationProvider } from './contexts/LocalizationsContext';
import SetupAccountScreen from "./screens/setup_account/SetupAccountScreen";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import PetSelectionScreen from "./screens/pet_selection/PetSelectionScreen";
import BookSelection from "./components/BookSelection/BookSelection";
import Keyboard from "./components/Keyboard/Keyboard";
import StoryTelling from "./components/StoryTelling/StoryTelling";
import Dictionary from "./components/Dicctionary/Dictionary";

function App() {
    return (
        <Router>
            <div className="App">
                <LocalizationProvider>
                    <UserProfileProvider>
                        <Routes>
                            <Route path="/" element={<SetupAccountScreen />} />
                            <Route path="/pet-selection" element={<PetSelectionScreen />} />
                            <Route path="/book-selection" element={<BookSelection />} />
                            <Route path="/keyboard" element={<Keyboard />} />
                            <Route path="/story-telling" element={<StoryTelling />} />
                            <Route path="/dicctionary" element={<Dictionary />} />
                        </Routes>
                    </UserProfileProvider>
                </LocalizationProvider>
            </div>
        </Router>
    );
}

export default App;
