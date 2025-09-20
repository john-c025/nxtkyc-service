import React, { useState, useEffect } from 'react';
import { ModalOverlay, ModalContent, Button, FilterSection } from './FilterModalStyled';

const FilterModal = ({ isOpen, onClose, onSave, companies, selectedCompanies, isDarkMode, setSortOrder }) => {
    const [localSelectedCompanies, setLocalSelectedCompanies] = useState([]);
    const [filters, setFilters] = useState({
        age: false,
        borrower_name: false,
    
        overdue: false,
        balance: false,
        remain: false,
    });

    useEffect(() => {
        setLocalSelectedCompanies(selectedCompanies);
    }, [selectedCompanies]);

    const handleCompanyChange = (companyName) => {
        if (companyName === 'all') {
            setLocalSelectedCompanies([]);
        } else {
            setLocalSelectedCompanies([companyName]);
        }
    };

    const handleFilterChange = (filterName) => {
        if (filterName === 'none') {
            setFilters({
                age: false,
                borrower_name: false,
                overdue: false,
                balance: false,
                remain: false,
            });
        } else {
            setFilters({
                age: false,
                borrower_name: false,
                overdue: false,
                balance: false,
                remain: false,
                [filterName]: true,
            });
        }
    };

    const handleSave = () => {
        onSave(localSelectedCompanies, filters);
        onClose();
    };

    return isOpen ? (
        <ModalOverlay isDarkMode={isDarkMode}>
            <ModalContent isDarkMode={isDarkMode}>
                <h2>Filter Options</h2>
                <FilterSection>
                    <div>
                        <h3>By Company</h3>
                        <div>
                            <input
                                type="radio"
                                name="company"
                                checked={localSelectedCompanies.length === 0}
                                onChange={() => handleCompanyChange('all')}
                            />
                            <label>{" All"}</label>
                        </div>
                        {companies.map(company => (
                            <div key={company.company_id}>
                                <input
                                    type="radio"
                                    name="company"
                                    checked={localSelectedCompanies.includes(company.company_name)}
                                    onChange={() => handleCompanyChange(company.company_name)}
                                />
                                <label>{" "+company.company_name}</label>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3>By Column</h3>
                        <div>
                            <input
                                type="radio"
                                name="filter"
                                checked={Object.values(filters).every(value => !value)}
                                onChange={() => handleFilterChange('none')}
                            />
                            <label>{" None"}</label>
                        </div>
                        {Object.keys(filters).map(filterName => (
                            <div key={filterName}>
                                <input
                                    type="radio"
                                    name="filter"
                                    checked={filters[filterName]}
                                    onChange={() => handleFilterChange(filterName)}
                                />
                                <label>{" "+filterName.replace('_', ' ')}</label>
                            </div>
                        ))}
                    </div>
                </FilterSection>
                <div>
                    <h3>Sort By</h3>
                    <select onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <Button className="primary" onClick={handleSave}>Save</Button>
                <Button className="secondary" onClick={onClose}>Cancel</Button>
            </ModalContent>
        </ModalOverlay>
    ) : null;
};

export default FilterModal;
  