import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  gap: 15px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FilterInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  flex: 1 1 200px;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  flex: 1 1 200px;
`;

const SearchFilters = ({
                           searchQuery,
                           authorQuery,
                           exchangeDescriptionQuery,
                           bookConditionFilter,
                           genreFilter,
                           setSearchQuery,
                           setAuthorQuery,
                           setExchangeDescriptionQuery,
                           setBookConditionFilter,
                           setGenreFilter,
                           uniqueBookConditions,
                           uniqueGenres
                       }) => {
    return (
        <FilterContainer>
            <FilterInput
                type="text"
                placeholder="Tytuł..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />
            <FilterInput
                type="text"
                placeholder="Autor..."
                value={authorQuery}
                onChange={e => setAuthorQuery(e.target.value)}
            />
            <FilterInput
                type="text"
                placeholder="Opis wymiany..."
                value={exchangeDescriptionQuery}
                onChange={e => setExchangeDescriptionQuery(e.target.value)}
            />
            <FilterSelect value={bookConditionFilter} onChange={e => setBookConditionFilter(e.target.value)}>
                <option value="">Dowolny stan książki</option>
                {uniqueBookConditions.map((condition, index) => (
                    <option key={index} value={condition}>{condition}</option>
                ))}
            </FilterSelect>
            <FilterSelect value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
                <option value="">Dowolny gatunek</option>
                {uniqueGenres.map((genre, index) => (
                    <option key={index} value={genre}>{genre}</option>
                ))}
            </FilterSelect>
        </FilterContainer>
    );
};

export default SearchFilters;