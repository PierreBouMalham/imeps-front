import {
  Autocomplete,
  Avatar,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

export default function Dropdown({
  required,
  name,
  label,
  textFieldProps,
  defaultValue,
  options,
  onChange,
  loading,
  renderInput,
  enableImage,
  multiple = false, // default to false to avoid breaking existing code
  ...props
}) {
  // Initialize internal state
  const [selected, setSelected] = useState(
    multiple
      ? Array.isArray(defaultValue)
        ? defaultValue
        : defaultValue
        ? [defaultValue]
        : []
      : defaultValue
  );

  // Compute the Autocomplete value based on `multiple`
  const autocompleteValue = useMemo(() => {
    if (!options) {
      return multiple ? [] : {};
    }
    if (multiple) {
      // Return an array of matched options
      return options.filter((opt) => selected?.includes(opt.value));
    } else {
      // Return a single matched option
      return options.find((opt) => opt.value == selected) || {};
    }
  }, [options, selected, multiple]);

  // Update state if defaultValue changes
  useEffect(() => {
    if (multiple) {
      setSelected(
        Array.isArray(defaultValue)
          ? defaultValue
          : defaultValue
          ? [defaultValue]
          : []
      );
    } else {
      setSelected(defaultValue);
    }
  }, [defaultValue, multiple]);

  return (
    <>
      <Autocomplete
        // Pass `multiple` to MUI Autocomplete
        multiple={multiple}
        required={required}
        options={options}
        value={autocompleteValue}
        onChange={(event, newValue) => {
          if (multiple) {
            // For multiple selection, store an array of values
            const valuesArray = newValue?.map((item) => item.value) || [];
            setSelected(valuesArray);
            onChange?.(valuesArray);
          } else {
            // For single selection, store a single value
            setSelected(newValue?.value);
            onChange?.(newValue?.value);
          }
        }}
        // If you want keys for each option, MUI typically uses getOptionLabel or .key,
        // but if needed you can rename to getOptionKey. We'll keep getOptionLabel only.
        // getOptionKey={(option) => option.value} // Not part of standard Autocomplete props
        getOptionLabel={(option) => option.label || ""}
        getOptionKey={(option) => option.value}
        renderInput={
          renderInput ??
          ((params) => (
            <TextField
              required={required}
              label={label}
              {...(typeof textFieldProps === "function"
                ? textFieldProps(autocompleteValue, params)
                : textFieldProps)}
              {...params}
            />
          ))
        }
        renderOption={
          enableImage
            ? (props, option) => {
                return (
                  <Box
                    {...props}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Avatar
                      sx={{ width: 28, height: 28, fontSize: "12px" }}
                      src={option.image}
                    >
                      {option.label
                        ?.split(" ")
                        ?.map((v) => v?.[0]?.toUpperCase())
                        ?.join("")}
                    </Avatar>
                    <Typography variant="inherit">{option.label}</Typography>
                  </Box>
                );
              }
            : undefined
        }
        loading={loading}
        loadingText={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100px",
            }}
          >
            <CircularProgress
              color="primary"
              size={20}
              thickness={6}
              disableShrink
            />
          </Box>
        }
        {...props}
      />
      {/* Hidden input to preserve form submission, as before */}
      {
        <input
          type="hidden"
          name={name}
          value={multiple ? JSON.stringify(selected || []) : selected || ""}
        />
      }
    </>
  );
}
