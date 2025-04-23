import React, { useState, useEffect } from 'react';
import Input from '../atoms/Input';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debounceTime?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm,
  debounceTime = 500 
}) => {
  // Local state for immediate input changes
  const [inputValue, setInputValue] = useState(searchTerm);
  
  // Effect to debounce the search term updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(inputValue);
    }, debounceTime);
    
    return () => clearTimeout(timer);
  }, [inputValue, debounceTime, setSearchTerm]);
  
  // When searchTerm prop changes externally
  useEffect(() => {
    if (searchTerm !== inputValue) {
      setInputValue(searchTerm);
    }
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="mb-6 flex justify-start">
      <Input
        type="text"
        placeholder="Search users..."
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;