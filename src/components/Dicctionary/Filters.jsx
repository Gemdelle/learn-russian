import Filter from "./Filter";
import './styles/Filters.css';
import CATEGORIES from "./data/categories";

export const Filters = ({selectedCategories, onSelectCategory}) => {
    return (
        <div className="filters-container">
            {
                CATEGORIES.map((categoryName, index) => {
                    let needsToBeSelected = selectedCategories.find((category)=> category === categoryName) !== undefined;
                    return (<Filter key={index} name={categoryName} onSelectCategory={onSelectCategory} selected={needsToBeSelected}/>)
                })
            }
        </div>
    );
};