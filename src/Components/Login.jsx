import React from 'react'
import {Box, Card, Typography,InputAdornment } from '@mui/material'
import Image1 from '../Images/loginimg.jpg'
import Image2 from '../Images/front-office-img.png'
import TextField from '@mui/material/TextField';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useState, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { AuthContext } from './AuthContext';


export const Login = () => {

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
  
    const handleChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.get("http://localhost:5000/users");
        const foundUser = data.find(
          (user) =>
            user.email === credentials.email && user.password === credentials.password
        );
  
        if (foundUser) {
          login(foundUser);
          const userRole = foundUser.role?.trim().toLowerCase();
          if (userRole === 'admin') {
            navigate("/admin");
          } else if (userRole === 'job_seeker') {
            navigate("/joblisting");
          } else {
            navigate("/jobposting");
          }
        
        } else {
          alert("Invalid email or password.");
        }
      } catch (error) {
        console.error("Login failed:", error);
        alert("Network error. Please try again.");
      }
    };

  return (
    <Box sx={{height:"100vh",width:"100%",backgroundImage:`url(${Image1})`,backgroundSize:"cover",display:"flex",justifyContent:"center",alignItems:"center",backgroundPosition:"center",filter:"none",backgroundRepeat:"no-repeat"}}>
        <Card sx={{height:"500px",width:"80%",backgroundColor:"white",display:"flex",alignItems:"center",position:"relative"}}>
        <Box sx={{height:"50px",width:"100px",position:"absolute",top:"5px",left:"5px",display:"flex",alignItems:"center",pl:5}}>
            <Typography variant='h6' sx={{fontWeight:"600",fontFamily:"Brush Script MT (cursive)"}}>DreamHire</Typography>
        </Box>
        <Box sx={{height:"370px",width:"60%",ml:2}}>
            <img src={Image2} alt='img' height={"100%"} width={"100%"}/>
        </Box>
        <Box sx={{height:"100%",width:"40%",ml:5,mr:5,mt:4,display:"flex",flexDirection:"column",}}>
            <Typography variant='h4' sx={{textAlign:"start",mt:5}}>Login</Typography>
            <form onSubmit={handleSubmit}>
            <TextField id="standard-basic" name='email' sx={{mt:3,width:"100%","& .MuiInput-underline:before": { borderBottomColor: "orange" },"& .MuiInput-underline:after": { borderBottomColor: "orange" },
            }} required type='email' placeholder='Enter your e-mail' variant="standard" onChange={handleChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <EmailIcon sx={{color:"orange"}} />
                    </InputAdornment>
                )
            }}/>
            <TextField id="standard-basic" name='password' sx={{mt:3,width:"100%","& .MuiInput-underline:before": { borderBottomColor: "orange" },"& .MuiInput-underline:after": { borderBottomColor: "orange" },}} required type='password' placeholder='Password' variant="standard"  onChange={handleChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <LockIcon sx={{color:"orange"}} />
                    </InputAdornment>
                )
            }}/>
            <Button type='submit' variant="contained" sx={{mt:6,backgroundColor:"orange",width:"100%"}}>Login</Button>
            </form>
            <Typography sx={{ mt: 2 }}>Don't have an account?{" "}
                <span style={{ color: "orange", cursor: "pointer" }}onClick={() => navigate("/register")}>Register</span>
            </Typography>

        </Box>
        </Card>
    </Box>
  )
}
