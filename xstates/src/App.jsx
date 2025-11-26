import React, { useEffect, useState } from "react";

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    fetch("https://location-selector.labs.crio.do/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetch(
        `https://location-selector.labs.crio.do/country=${selectedCountry}/states`
      )
        .then((res) => res.json())
        .then((data) => setStates(data));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetch(
        `https://location-selector.labs.crio.do/country=${selectedCountry}/state=${selectedState}/cities`
      )
        .then((res) => res.json())
        .then((data) => setCities(data));
    }
  }, [selectedState, selectedCountry]);

  return (
    <div>
      <div>
        <h1>Select Location</h1>
      </div>
    <div style={{ padding: "20px" }}>
      <select
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          setSelectedState("");
          setSelectedCity("");
          setCities([]);
        }}
      >
        <option value="">Select Country</option>

        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      <select
        disabled={!selectedCountry}
        value={selectedState}
        onChange={(e) => {
          setSelectedState(e.target.value);
          setSelectedCity("");
        }}
      >
        <option value="">Select State</option>

        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
      <select
        disabled={!selectedState}
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="">Select City</option>

        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      {selectedCity && (
        <p style={{ marginTop: "20px", fontSize: "18px", fontWeight: "bold" }}>
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </p>
      )}
    </div>
    </div>
  );
};

export default LocationSelector;
