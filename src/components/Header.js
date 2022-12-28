import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons}) => 
{
  const history = useHistory();
  const userdata = localStorage.getItem("username");
  const islogin = userdata ? true : false;

  const logout = () =>
  {
    localStorage.clear();
    history.push("/");
    window.location.reload()
  }

  const backtoproductpage = () =>
  {
    history.push("/");
  }



  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}       {/* ====> to display search bar  */}
      {hasHiddenAuthButtons && (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={backtoproductpage}
        >
          Back to explore
        </Button>
      )}

      {!islogin && !hasHiddenAuthButtons && (
        // <Box>
        //   <Button variant="text" onClick={()=>history.push("/login")}>Login</Button>
        //   <Button variant="contained" onClick={()=>history.push("/register")}>Register</Button>
        // </Box>
        <Box>
                <Stack direction="row" spacing={1}>
                  <Button className="explore-button" variant="text" onClick={()=>history.push("/login")}>
                    LOGIN 
                  </Button>
                    
                  <Button className="button" variant="contained"onClick={()=>history.push("/register")}>
                    REGISTER
                  </Button>
                </Stack>
        </Box>
      )}



      {islogin && (
        <Stack direction="row" justifyContent="center" alignItems="center">
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Avatar alt={userdata} src="avatar.png" />
            <Box>{userdata}</Box>
            <Button variant="text" onClick={logout}>Logout</Button>
          </div>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
