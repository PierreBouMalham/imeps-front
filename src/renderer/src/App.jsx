import { Logout } from "@mui/icons-material"
import { AppBar, Box, Button, ButtonGroup, IconButton, Toolbar, Typography } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { Link, Outlet, useLocation } from "react-router"
import { useAuth } from "./contexts/Auth.context"
import entities from "./entities"
import Login from "./views/Login"

export default function App() {
  const location = useLocation()
  const auth = useAuth()

  if (auth.loading) {
    return "Loading..."
  }

  if (!auth.user) {
    return <Login />
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: "100vw", width: "100%" }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "white"
          }}
          elevation={0}
          variant="outlined"
        >
          <Toolbar
            sx={{
              minHeight: "0 !important",
              padding: "0 12px !important"
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={(theme) => ({
                flexGrow: 1,
                color: theme.palette.text.primary,
                fontWeight: "700",
                lineHeight: "0px"
              })}
            >
              IMEPS
            </Typography>

            <ButtonGroup>
              <Button
                sx={{
                  borderRadius: "0px",
                  textDecoration: location.pathname == "/" ? "underline" : "none",
                  opacity: location.pathname == "/" ? 1 : 0.6,
                  color: "black"
                }}
                disableElevation
                LinkComponent={Link}
                to={"/"}
                variant={"text"}
              >
                Reports
              </Button>
              {entities.map((entity) => {
                return (
                  <Button
                    sx={{
                      borderRadius: "0px",
                      textDecoration: location.pathname.includes(entity.url) ? "underline" : "none",
                      opacity: location.pathname.includes(entity.url) ? 1 : 0.6,
                      color: "black"
                    }}
                    disableElevation
                    LinkComponent={Link}
                    to={entity.url}
                    key={"Button netit: " + entity.url}
                    variant={"text"}
                  >
                    {entity.name.plural}
                  </Button>
                )
              })}
            </ButtonGroup>
            <IconButton
              onClick={() => {
                auth.logout()
              }}
              sx={{ ml: 1 }}
              size="small"
            >
              <Logout fontSize="small" />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Outlet />
      </Box>
    </LocalizationProvider>
  )
}
