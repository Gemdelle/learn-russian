import React, { useState, useEffect } from 'react';

const BookSelection = () => {
    const [styles, setStyles] = useState(null);

    useEffect(() => {
        let mounted = true;

        const loadStyles = async () => {
            try {
                const styleModule = await import('./styles/BookSelection.css');
                if (mounted) {
                    setStyles(styleModule.default);
                    console.log('CSS loaded');
                }
            } catch (err) {
                console.error('Failed to load CSS', err);
            }
        };

        loadStyles();

        return () => {
            mounted = false;
            console.log('Component unmounted, CSS cleanup handled by React');
        };
    }, []);

    if (!styles) {
        return <div>Loading...</div>; // Or any loading indicator you prefer
    }

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