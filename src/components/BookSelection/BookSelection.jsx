import React from 'react';
import './styles/BookSelection.css';

const BookSelection = () => {
    return (
        <div className="main-content">
            <h1>
                RUSSIAN STORIES
                <small>Collection of russian stories to learn</small>
            </h1>
            <div className="moleskine-wrapper">
                <div className="moleskine-notebook">
                    <div className="notebook-cover orange"></div>
                    <div className="notebook-skin">
                        EL ZORRO ELDRIC
                    </div>
                    <div className="notebook-page">Gobernante sabio</div>
                </div>
            </div>
            <div className="moleskine-wrapper">
                <div className="moleskine-notebook">
                    <div className="notebook-cover blue"></div>
                    <div className="notebook-skin">
                        Notebook 2
                    </div>
                    <div className="notebook-page"></div>
                </div>
            </div>
            <div className="moleskine-wrapper">
                <div className="moleskine-notebook">
                    <div className="notebook-cover green"></div>
                    <div className="notebook-skin">
                        Notebook 3
                    </div>
                    <div className="notebook-page"></div>
                </div>
            </div>
            <div className="moleskine-wrapper">
                <div className="moleskine-notebook">
                    <div className="notebook-cover yellow"></div>
                    <div className="notebook-skin">
                        Notebook 4
                    </div>
                    <div className="notebook-page"></div>
                </div>
            </div>
        </div>
    );
};

export default BookSelection;
