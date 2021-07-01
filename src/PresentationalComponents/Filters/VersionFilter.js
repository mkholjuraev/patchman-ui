import React from 'react';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
const VersionFilter = (apply, filter, packageVersions) => {
    const isSet = filter && filter.installed_evra;
    const installedEvra = isSet && filter.installed_evra.split(',') || [''];
    const versionList = packageVersions.data && packageVersions.data.sort().map(version => ({ value: version.evra }))
        || [{ value: 'No version is available', disabled: true }];

    const [isOpen, setOpen] = React.useState(false);
    const [numOptions, setNumOptions] = React.useState(5);
    const [isLoading, setLoading] = React.useState(false);
    const onToggle = (isOpen) => {
        setOpen(isOpen);
    };

    const onSelect = (_, selection) => {
        const existingVersions = isSet && filter.installed_evra !== '' && filter.installed_evra.concat(',') || '';
        apply({ filter: { installed_evra: `${existingVersions}${selection}` } });
    };

    const clearSelection = () => {
        setOpen(false);
    };

    const simulateNetworkCall = callback => {
        setTimeout(callback, 1000);
    };

    const onViewMoreClick = () => {
        setLoading(true);
        simulateNetworkCall(() => {
            const newLength =
                numOptions + 3 <= versionList.length ? numOptions + 3 : versionList.length;
            setNumOptions(newLength);
            setLoading(false);
        });
    };

    return (
        {
            type: conditionalFilterType.custom,
            label: 'Version filter',
            value: 'custom',
            filterValues: {
                children: (
                    <Select
                        variant={versionList.length > 0 && SelectVariant.checkbox || SelectVariant.typeaheadMulti}
                        typeAheadAriaLabel="Filter by package version"
                        onToggle={onToggle}
                        onSelect={onSelect}
                        onClear={clearSelection}
                        selections={installedEvra}
                        isOpen={isOpen}
                        aria-labelledby={'patch-version-filter'}
                        placeholderText="Filter by package version"
                        {...(!isLoading && numOptions < versionList.length
                            && { loadingVariant: { text: 'View more', onClick: onViewMoreClick } })}
                        {...(isLoading && { loadingVariant: 'spinner' })}
                        style={{ maxHeight: '400px', overflow: 'auto' }}
                    >
                        {versionList.slice(0, numOptions).map((option, index) => (
                            <SelectOption
                                isDisabled={option.disabled}
                                key={index}
                                value={option.value}
                                {...(option.description && { description: option.description })}
                            />
                        ))}
                    </Select>
                )
            }
        }
    );

};

export default VersionFilter;
