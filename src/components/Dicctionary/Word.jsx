import './styles/Word.css';

export const Word = ({word: {text, categories}, selectedCategories}) => {
    const wordFilteredCategory = selectedCategories.filter(element => categories.includes(element));

    const retrieveAllWords = () => {
        let allCategories = categories.map((category, index) => {
            let firstCharacter = category[0].toUpperCase();
            return <div key={index}>{firstCharacter}</div>
        });

        return [
            <span>{text}</span>,
            allCategories
        ];
    }

    const retrieveFilteredWords = () => {
        const filteredCategories = wordFilteredCategory
            .map((category, index) => {
                let firstCharacter = category[0].toUpperCase();
                return (<div key={index}>{firstCharacter}</div>)
            })
        let canNotShowWord = filteredCategories.length === 0;

        if(canNotShowWord)
            return null

        return [
            <span>{text}</span>,
            filteredCategories
        ];
    }

    return (
        <div className="word-container">
            {
                selectedCategories.length === 0 ? retrieveAllWords() : retrieveFilteredWords()
            }
        </div>
    );
};