import symbolImg from '../../assets/img/symbols/symbol-mournferra.png';
import './Header.scss';

const TABS = [
  { id: 'stories', label: 'Stories' },
  { id: 'reading', label: 'Reading' },
  { id: 'dictionary', label: 'Dictionary' },
];

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="header">
      <img
        className="header__symbol"
        src={symbolImg}
        alt="Mourneferra"
      />
      <nav className="header__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`header__btn ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
