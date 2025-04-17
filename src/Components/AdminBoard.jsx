import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Tabs, Tab, Button,Grid } from '@mui/material';
import axios from 'axios';
import Image1 from '../Images/background.jpeg';

const AdminBoard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);


  // Fetch all users
  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(res => {
        const allUsers = res.data;
        setUsers(allUsers.filter(user => user.role === 'job_seeker'));
        setEmployers(allUsers.filter(user => user.role === 'employer'));
      })
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  // Fetch all job applications
  useEffect(() => {
    axios.get('http://localhost:5000/applications')
      .then(res => setApplications(res.data))
      .catch(err => console.error('Error fetching applications:', err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/jobs")
      .then(res => setJobs(res.data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);
  

  // Handle tab switching
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Delete a user (either applicant or employer)
  const handleDeleteUser = (id) => {
    axios.delete(`http://localhost:5000/users/${id}`)
      .then(() => setUsers(prev => prev.filter(user => user.id !== id)))
      .catch(err => console.error('Error deleting user:', err));
  };

  // Delete an employer
  const handleDeleteEmployer = (id) => {
    axios.delete(`http://localhost:5000/users/${id}`)
      .then(() => setEmployers(prev => prev.filter(user => user.id !== id)))
      .catch(err => console.error('Error deleting employer:', err));
  };

  // Delete a job application
  const handleDeleteApplication = (id) => {
    axios.delete(`http://localhost:5000/applications/${id}`)
      .then(() => setApplications(prev => prev.filter(app => app.id !== id)))
      .catch(err => console.error('Error deleting application:', err));
  };

  const handleDeleteJob = (id) => {
    axios.delete(`http://localhost:5000/jobs/${id}`)
      .then(() => setJobs(prev => prev.filter(job => job.id !== id)))
      .catch(err => console.error('Error deleting job:', err));
  };  

  return (
    <Box sx={{ p: 4,height:"100vh",backgroundImage:`url(${Image1})`,backgroundSize:"cover",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundPosition:"center",filter:"none",backgroundRepeat:"no-repeat" }}>
      <Typography variant="h4"sx={{textAlign:"center",color:"white"}} gutterBottom>Admin Dashboard</Typography>

      <Tabs sx={{mt:5,}} value={tabValue} onChange={handleChange} centered>
        <Tab label="Employers" />
        <Tab label="Applicants" />
        <Tab label="Applications" />
        <Tab label="Job Listings" />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={3} sx={{ mt: 3 }} justifyContent="center">
          {employers.map(emp => (
            <Grid item key={emp.id} lg={3} md={4} sm={6} xs={12}>
              <Card sx={{maxWidth:345}}>
                <CardContent sx={{ textAlign: "center", }}>
                <Typography variant="h6">Name: {emp.fullName}</Typography>
                  <Typography>Email: {emp.email}</Typography>
                  <Typography>Role: {emp.role}</Typography>
                  <Typography>Company: {emp.company}</Typography>
                  <Button color="error" onClick={() => handleDeleteEmployer(emp.id)}>Delete</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3} sx={{ mt: 3 }} justifyContent="center">
          {users.map(user => (
            <Grid item key={user.id} lg={3} md={4} sm={6} xs={12}>
              <Card sx={{ maxWidth: 345, margin: 'auto' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">Name: {user.fullName}</Typography>
                  <Typography>Email: {user.email}</Typography>
                  <Typography>Role: {user.role}</Typography>
                  <Button color="error" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3} sx={{ mt: 3 }} justifyContent="center">
          {applications.map(app => (
            <Grid item key={app.id} lg={3} md={4} sm={6} xs={12}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6">{app.applicantName}</Typography>
                  <Typography>Email: {app.email}</Typography>
                  <Typography>Job Title: {app.jobTitle}</Typography>
                  <Typography>Company:{app.company}</Typography>
                  <Button color="error" onClick={() => handleDeleteApplication(app.id)}>Delete</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {tabValue === 3 && (
        <Grid container spacing={3} sx={{ mt: 3 }} justifyContent="center">
          {jobs.map(job => (
            <Grid item key={job.id} lg={3} md={4} sm={6} xs={12}>
              <Card sx={{ maxWidth: 345, margin: 'auto' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography>Company: {job.company}</Typography>
                  <Typography>Location: {job.location}</Typography>
                  <Button color="error" onClick={() => handleDeleteJob(job.id)}>Delete</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminBoard;
