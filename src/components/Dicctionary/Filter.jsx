import './styles/Filter.css';
const Filter = ({name, selected, onSelectCategory}) => {
    return (
        <div className={selected ? "selected": ""} onClick={() => onSelectCategory(name)}>
            {name}
        </div>
    );
};

export default Filter;