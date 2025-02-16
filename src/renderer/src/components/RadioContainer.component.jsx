import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function RadioContainer({
  label,
  options,
  defaultValue,
  value: outsiderValue,
  onChange,
}) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (outsiderValue != value) setValue(outsiderValue);
  }, [outsiderValue]);

  return (
    <FormControl sx={{ width: "100%" }}>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {options?.map((option) => {
          return (
            <RadioElement
              key={"Radio option: " + option.value + label + option.label}
              value={option.value}
              label={option.label}
              selected={option.value == value}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}

function RadioElement({ selected, value, label }) {
  return (
    <FormControlLabel
      sx={(theme) => ({
        flex: 1,
        border: "1px solid",
        m: 0,
        mr: 1,
        px: 2.5,
        py: 1.85,
        borderRadius: "12px",
        borderColor: selected ? "primary.main" : "divider",
        backgroundColor: selected
          ? theme.palette.primary.main + "33"
          : "divider",
        display: "flex",
        flexDirection: "row",
        gap: 1,
      })}
      value={value}
      control={
        <Radio
          color="black"
          sx={{ margin: "0 !important", padding: "0 !important" }}
        />
      }
      label={label}
    />
  );
}
