import React from 'react';

const SearchBar = () => {
  return (
    <div className="form-group">
      <label htmlFor="search">Search</label>
      <input type="text" className="form-control" id="search" />
    </div>
  );
};

export default SearchBar;
