import React, { useEffect } from "react";
import "./App.css";

const App = () => {
    const [query, setQuery] = React.useState(" ");
    const [elements, setElements] = React.useState([]);
    const [selectedType, setSelectedType] = React.useState(0);
    const types = ["All", "All not completed", "All completed"];

    let timeout;

    const debounceSetQuery = (value) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => setQuery(value), 250);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    "https://jsonplaceholder.typicode.com/todos/"
                );
                const data = await res.json();
                let filteredData = data.filter((item) =>
                    item.title.toLowerCase().includes(query.toLowerCase())
                );

                if (selectedType === "All not completed") {
                    filteredData = filteredData.filter(
                        (item) => !item.completed
                    );
                } else if (selectedType === "All completed") {
                    filteredData = filteredData.filter(
                        (item) => item.completed
                    );
                }

                setElements(filteredData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [query, selectedType]);

    const onSelect = (event) => {
        setSelectedType(event.target.value);
    };

    return (
        <div className="container">
            <div>
                <h1>REST API</h1>
                <div className="search-wrapper">
                    <input
                        placeholder="Search"
                        autoCapitalize="false"
                        spellCheck="false"
                        onKeyUp={(e) => debounceSetQuery(e.target.value)}
                    />
                    <select onChange={onSelect} value={selectedType}>
                        {types.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <ul>
                {elements.length ? (
                    elements.map((item) => (
                        <li key={item.id}>
                            <span>{item.title}</span>
                            <pre>{item.completed ? "✓" : ""}</pre>
                        </li>
                    ))
                ) : (
                    <p>No results found</p>
                )}
            </ul>
        </div>
    );
};

export default App;
