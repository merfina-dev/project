import { Box, Card,TextField,Typography,InputAdornment,Button,Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import React, { useContext,useState } from 'react'
import Image1 from '../Images/loginimg.jpg'
import Image2 from '../Images/girl.jpg'
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import {useNavigate} from 'react-router-dom';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import BusinessIcon from '@mui/icons-material/Business';



export const Register = () => {

  const {login} =useContext(AuthContext)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', 
    company:''
  });
  const [error, setError] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation checks
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword ||!formData.role) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { data } = await axios.get("http://localhost:5000/users");
      const userExists = data.some(user => user.email === formData.email);

      if (userExists) {
        setError("Email already exists. Please use a different email.");
        return;
      }

      const newUser = {
        id: data.length + 1,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        company:formData.company
      };

      const response = await axios.post("http://localhost:5000/users", newUser);

      login(response.data); // Auto-login after registration
      if (formData.role.toLowerCase() === 'job_seeker') {
        navigate("/joblisting");
      } else {
        navigate("/jobposting");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Something went wrong. Please try again.");
    }
  };
  return (
    <Box sx={{height:"100vh",width:"100%",backgroundImage:`url(${Image1})`,backgroundSize:"cover",display:"flex",justifyContent:"center",alignItems:"center",backgroundPosition:"center",filter:"none",backgroundRepeat:"no-repeat"}}>
      <Card sx={{height:"500px",width:"80%",display:"flex",backgroundColor:"white"}}>
        <Box sx={{height:"500px",width:"50%"}}>
          <Typography variant='h4' sx={{textAlign:"start",mt:1,ml:4}}>Create Account</Typography>
          <form onSubmit={handleSubmit}>
            <TextField id="standard-basic" name='fullName' variant='standard'sx={{mt:3,ml:4,width:"80%","& .MuiInput-underline:before": { borderBottomColor: "orange" },"& .MuiInput-underline:after": { borderBottomColor: "orange" },
            }} required placeholder='Full Name' onChange={handleChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <PersonIcon sx={{color:"orange"}} />
                    </InputAdornment>
                )
            }}/>
            <TextField id="standard-basic" onChange={handleChange} name='email' variant='standard'sx={{mt:3,ml:4,width:"80%","& .MuiInput-underline:before": { borderBottomColor: "orange" },"& .MuiInput-underline:after": { borderBottomColor: "orange" },
            }} required placeholder='Enter your E-mail'
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <EmailIcon sx={{color:"orange"}} />
                    </InputAdornment>
                )
            }}/>
            <TextField id="standard-basic" onChange={handleChange} name='password' variant='standard'sx={{mt:3,ml:4,width:"80%","& .MuiInput-underline:before": { borderBottomColor: "orange" },"& .MuiInput-underline:after": { borderBottomColor: "orange" },
            }} required type='password' placeholder='Password'
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <LockIcon sx={{color:"orange"}} />
                    </InputAdornment>
                )
            }}/>
            <TextField id="standard-basic" onChange={handleChange} name='confirmPassword' variant='standard'sx={{mt:3,ml:4,width:"80%","& .MuiInput-underline:before": { borderBottomColor: "orange" },"& .MuiInput-underline:after": { borderBottomColor: "orange" },
            }} required type='password' placeholder='Confirm Password'
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <LockIcon sx={{color:"orange"}} />
                    </InputAdornment>
                )
            }}/>
            <FormControl variant="standard" sx={{ mt: 3, ml: 4, width: "80%" }}>
              <InputLabel id="role-label" sx={{ color: 'orange' }}>Select Role</InputLabel>
              <Select labelId="role-label" name="role" value={formData.role} required onChange={handleChange} sx={{  "&:before": { borderBottomColor: "orange" },  "&:after": { borderBottomColor: "orange" },  }}>
                <MenuItem value="job_seeker">Job Seeker</MenuItem>
                <MenuItem value="employer">Employer</MenuItem>
              </Select>
            </FormControl>

            {formData.role.toLowerCase() === 'employer' && (
              <TextField id="standard-basic" onChange={handleChange} name='company'  variant='standard' sx={{ mt: 3, ml: 4, width: "80%",  "& .MuiInput-underline:before": { borderBottomColor: "orange" },  "& .MuiInput-underline:after": { borderBottomColor: "orange" },}} required placeholder='Company Name'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon sx={{ color: "orange" }} />
                    </InputAdornment>
                  )
                }}
              />
            )}
            {error && (
              <Typography sx={{ mt: 2,ml:4 }} color="error">
                {error}
              </Typography>
            )}
            <Button type='submit' variant="contained" sx={{mt:4,ml:4,backgroundColor:"orange",width:"80%"}}>Register</Button>
          </form>
          <Typography sx={{ mt: 2 ,ml:4}}>Already have an account?{" "}
            <span style={{ color: "orange", cursor: "pointer" }}onClick={() => navigate("/")}>Login</span>
          </Typography>
        </Box>
        <Box sx={{height:"500px",width:"50%",position:"relative"}}>
        <Box sx={{height:"50px",width:"100px",position:"absolute",top:"5px",right:"45px",display:"flex",alignItems:"center",pl:5,}}>
            <Typography variant='h6' sx={{fontWeight:"600",fontFamily:"Brush Script MT (cursive)"}}>DreamHire</Typography>
        </Box>
          <img src={Image2} height={'100%'} width={'100%'} alt='girl'/>
        </Box>
      </Card>
    </Box>
  )
}
