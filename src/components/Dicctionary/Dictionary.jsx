import {Filters} from "./Filters";
import {Words} from "./Words";
import './styles/Dictionary.css';
import {useState} from "react";

const Dictionary = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const onSelectCategory = (someSelectedCategory) => {
        const isANewFilterToAdd = selectedCategories.find((category) => category === someSelectedCategory)

        if (isANewFilterToAdd === undefined) {
            const nextFilters = [...selectedCategories, someSelectedCategory];
            setSelectedCategories(nextFilters);
        } else {
            const nextFilters = selectedCategories.filter((category) => category !== someSelectedCategory);
            setSelectedCategories(nextFilters);
        }
    }

    return (
        <div className="dictionary-container">
            <Filters selectedCategories={selectedCategories} onSelectCategory={onSelectCategory}/>
            <Words selectedCategories={selectedCategories}/>
        </div>
    );
};

export default Dictionary;