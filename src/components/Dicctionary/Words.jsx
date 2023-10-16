import data from './data/data.json'
import {Word} from "./Word";
import './styles/Words.css';

export const Words = ({selectedCategories}) => {
    const words = data.words;
    return (
        <div className="words-container">
            {
                words.map((word, index)=> {
                    return (<Word key={index} word={word} selectedCategories={selectedCategories}/>);
                })
            }
        </div>
    );
};