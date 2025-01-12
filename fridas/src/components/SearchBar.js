import React from "react";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar produtos..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)} // Passa o valor digitado para o parent
      />
    </div>
  );
};

export default SearchBar;
