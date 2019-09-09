import React from 'react';

const SearchBar = props => {
  return (
    <div className="form-group">
      <label htmlFor="search">Search</label>
      <input
        type="text"
        className="form-control"
        id="search"
        value={props.searchTerm}
        onChange={e => props.searchCallback(e.target.value.toLowerCase())}
      />
    </div>
  );
};

export default SearchBar;
