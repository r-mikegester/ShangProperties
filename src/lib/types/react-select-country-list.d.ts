// src/react-select-country-list.d.ts
declare module 'react-select-country-list' {
    interface CountryData {
        label: string;
        value: string;
    }

    interface CountryList {
        getData: () => CountryData[];
    }

    const countryList: () => CountryList;
    export default countryList;
}
