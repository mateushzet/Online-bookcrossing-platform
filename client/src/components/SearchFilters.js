import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  margin-bottom: 20px;
`;

const FilterHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h3`
  color: #333;
  margin: 0;
`;

const ToggleButton = styled.button`
  background-color: #627254;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  width: 100px;
`;

const Filters = styled.div`
  display: ${({ isFiltersExpanded }) => (isFiltersExpanded ? 'block' : 'none')};
  width: 100%;
  margin-top: 10px;
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;

  & > * {
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: black;
`;

const Input = styled.input`
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #627254;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #41542b;
  }
`;

const SearchFilters = ({
                           searchQuery,
                           authorQuery,
                           exchangeDescriptionQuery,
                           preferredBooksQuery,  // <-- Nowe pole
                           bookConditionFilter,
                           genreFilter,
                           cityInput,
                           setSearchQuery,
                           setAuthorQuery,
                           setExchangeDescriptionQuery,
                           setPreferredBooksQuery,  // <-- Nowe pole
                           setBookConditionFilter,
                           setGenreFilter,
                           handleCityInputChange,
                           handleCitySelect,
                           suggestions,
                           maxDistance,
                           setMaxDistance,
                           handleResetFilters,
                           uniqueBookConditions,
                           uniqueGenres,
                           isFiltersExpanded,
                           setIsFiltersExpanded,
                       }) => {
    return (
        <FilterContainer>
            <FilterHeader>
                <HeaderTitle>Filtry wyszukiwania</HeaderTitle>
                <ToggleButton onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}>
                    {isFiltersExpanded ? 'Zwiń' : 'Rozwiń'}
                </ToggleButton>
            </FilterHeader>
            <Filters isFiltersExpanded={isFiltersExpanded}>
                <FilterRow>
                    <div>
                        <Label htmlFor="searchQuery">Tytuł książki</Label>
                        <Input
                            id="searchQuery"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="authorQuery">Autor</Label>
                        <Input
                            id="authorQuery"
                            type="text"
                            value={authorQuery}
                            onChange={(e) => setAuthorQuery(e.target.value)}
                        />
                    </div>
                </FilterRow>
                <FilterRow>
                    <div>
                        <Label htmlFor="exchangeDescriptionQuery">Opis wymiany</Label>
                        <Input
                            id="exchangeDescriptionQuery"
                            type="text"
                            value={exchangeDescriptionQuery}
                            onChange={(e) => setExchangeDescriptionQuery(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="preferredBooksQuery">Preferowane książki</Label>
                        <Input
                            id="preferredBooksQuery"
                            type="text"
                            value={preferredBooksQuery}
                            onChange={(e) => setPreferredBooksQuery(e.target.value)}
                        />
                    </div>
                </FilterRow>
                <FilterRow>
                    <div>
                        <Label htmlFor="bookConditionFilter">Stan książki</Label>
                        <Select
                            id="bookConditionFilter"
                            value={bookConditionFilter}
                            onChange={(e) => setBookConditionFilter(e.target.value)}
                        >
                            <option value="">Dowolny</option>
                            {uniqueBookConditions.map((condition) => (
                                <option key={condition} value={condition}>
                                    {condition}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="genreFilter">Gatunek</Label>
                        <Select
                            id="genreFilter"
                            value={genreFilter}
                            onChange={(e) => setGenreFilter(e.target.value)}
                        >
                            <option value="">Dowolny</option>
                            {uniqueGenres.map((genre) => (
                                <option key={genre} value={genre}>
                                    {genre}
                                </option>
                            ))}
                        </Select>
                    </div>
                </FilterRow>
                <FilterRow>
                    <div>
                        <Label htmlFor="cityInput">Miejscowość</Label>
                        <Input
                            id="cityInput"
                            type="text"
                            value={cityInput}
                            onChange={handleCityInputChange}
                            list="suggestions"
                        />
                        <datalist id="suggestions">
                            {suggestions.map((suggestion, index) => (
                                <option key={index} value={suggestion.display_name} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <Label htmlFor="maxDistance">Maksymalna odległość</Label>
                        <Select
                            id="maxDistance"
                            value={maxDistance || ''}
                            onChange={(e) => setMaxDistance(e.target.value ? parseInt(e.target.value) : null)}
                        >
                            <option value="">Dowolna</option>
                            <option value="5">5 km</option>
                            <option value="10">10 km</option>
                            <option value="20">20 km</option>
                            <option value="50">50 km</option>
                            <option value="100">100 km</option>
                            <option value="200">200 km</option>
                        </Select>
                    </div>
                </FilterRow>
                <Button onClick={handleResetFilters}>Resetuj filtry</Button>
            </Filters>
        </FilterContainer>
    );
};

export default SearchFilters;
