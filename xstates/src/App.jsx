import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography
} from "@mui/material";

const API_BASE = "https://location-selector.labs.crio.do";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCountries() {
      setLoadingCountries(true);
      try {
        const res = await fetch(`${API_BASE}/countries`);
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        setError("Error fetching countries");
      } finally {
        setLoadingCountries(false);
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!country) {
      setStates([]);
      setStateName("");
      setCities([]);
      setCity("");
      return;
    }

    async function fetchStates() {
      setLoadingStates(true);
      try {
        const res = await fetch(`${API_BASE}/country=${country}/states`);
        const data = await res.json();
        setStates(data);
      } catch (err) {
        setError("Error fetching states");
      } finally {
        setLoadingStates(false);
      }
    }
    fetchStates();
  }, [country]);

  useEffect(() => {
    if (!stateName) {
      setCities([]);
      setCity("");
      return;
    }

    async function fetchCities() {
      setLoadingCities(true);
      try {
        const res = await fetch(
          `${API_BASE}/country=${country}/state=${stateName}/cities`
        );
        const data = await res.json();
        setCities(data);
      } catch (err) {
        setError("Error fetching cities");
      } finally {
        setLoadingCities(false);
      }
    }
    fetchCities();
  }, [stateName]);

  return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Select Location
      </Typography>

      <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Country</InputLabel>
          <Select
            value={country}
            label="Select Country"
            onChange={(e) => setCountry(e.target.value)}
          >
            <MenuItem key="placeholder-country" value="">
              {loadingCountries ? "Loading..." : "Select Country"}
            </MenuItem>

            {countries.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 200 }} disabled={!country}>
          <InputLabel>Select State</InputLabel>
          <Select
            value={stateName}
            label="Select State"
            onChange={(e) => setStateName(e.target.value)}
          >
            <MenuItem key="placeholder-state" value="">
              {!country ? "Select Country first" : loadingStates ? "Loading..." : "Select State"}
            </MenuItem>

            {states.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} disabled={!stateName}>
          <InputLabel>Select City</InputLabel>
          <Select
            value={city}
            label="Select City"
            onChange={(e) => setCity(e.target.value)}
          >
            <MenuItem key="placeholder-city" value="">
              {!stateName ? "Select State first" : loadingCities ? "Loading..." : "Select City"}
            </MenuItem>

            {cities.map((ct) => (
              <MenuItem key={ct} value={ct}>
                {ct}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      </Box>

      {city && stateName && country && (
        <Typography variant="h5" sx={{ mt: 4 }}>
          You selected <strong>{city}</strong>, <strong>{stateName}</strong>,{" "}
          <strong>{country}</strong>
        </Typography>
      )}

      {error && (
        <Typography sx={{ mt: 2, color: "red" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
