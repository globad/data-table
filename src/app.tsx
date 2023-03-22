import * as React from "react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import * as locales from "@mui/material/locale";
import { Users } from "./components/users/users";
import "./app.css";
import "./reset.css";

export default function App() {
  const theme = useTheme();
  const themeWithLocale = createTheme(theme, locales["ruRU"]);

  return (
    <ThemeProvider theme={themeWithLocale}>
      <Users />
    </ThemeProvider>
  );
}
