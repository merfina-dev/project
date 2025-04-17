import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Card, CardContent, Grid, Container} from '@mui/material';
import axios from 'axios';
import Image1 from '../Images/background.webp';

export const JobPosting = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    vacancies: ''
  });

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);


  const [editingJobId, setEditingJobId] = useState(null);

  const employer = JSON.parse(localStorage.getItem('user'));

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/jobs?employerId=${employer.id}`);
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employer?.id) {
      fetchJobs();
      setNewJob(prev => ({
        ...prev,
        company: employer.company || ''
      }));
    }
  }, [employer?.id]);

  const fetchApplicants = async (jobId) => {
    setLoadingApplicants(true);
    try {
      const res = await axios.get(`http://localhost:5000/applications?jobId=${jobId}`);
      setApplicants(res.data);
      setSelectedJobId(jobId);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoadingApplicants(false);
    }
  };
  

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handlePostJob = async () => {
    if (!newJob.title || !newJob.location || !newJob.type || !newJob.salary || !newJob.company || !newJob.vacancies) {
      alert("Please fill in all fields.");
      return;
    }

    const jobData = {
      ...newJob,
      employerId: employer.id
    };

    try {
      if (editingJobId) {
        await axios.put(`http://localhost:5000/jobs/${editingJobId}`, jobData);
      } else {
        await axios.post('http://localhost:5000/jobs', jobData);
      }

      setNewJob({ title: '', location: '', type: '', salary: '', company: employer.company || '', vacancies: '' });
      setEditingJobId(null);
      fetchJobs();
    } catch (error) {
      console.error('Error posting/updating job:', error);
    }
  };

  const handleEditClick = (job) => {
    setNewJob({
      title: job.title,
      location: job.location,
      type: job.type,
      salary: job.salary,
      company: job.company,
      vacancies: job.vacancies
    });
    setEditingJobId(job.id);
  };

  const handleDeleteJob = async (jobId) => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/jobs/${jobId}`);
      fetchJobs(); // Refresh job list
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <Box
      sx={{ minHeight: '100vh', width: '100%', backgroundImage: `url(${Image1})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', overflowX: 'hidden' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {employer?.company && (
          <Typography variant="h4" gutterBottom sx={{mt:5, textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
            {employer.company}
          </Typography>
        )}
        <Box mb={4} p={4} border="1px solid " borderRadius={2} mt={5} >
          <Typography variant="h6" gutterBottom>Post a New Job</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Job Title"
                name="title"
                value={newJob.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Company Name"
                name="company"
                value={newJob.company}
                onChange={handleChange}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Location"
                name="location"
                value={newJob.location}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Job Type (e.g., Full-time, Part-time)"
                name="type"
                value={newJob.type}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Number of Vacancies"
                name="vacancies"
                type="number"
                value={newJob.vacancies}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Salary"
                name="salary"
                value={newJob.salary}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handlePostJob}>
                {editingJobId ? "Update Job" : "Post Job"}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Grid container mt={5} spacing={4} justifyContent="center">
          {loading ? (
            <Box display="flex" justifyContent="center" mt={5}>
              <CircularProgress />
            </Box>
          ) : jobs.length === 0 ? (
            <Typography>No job postings found.</Typography>
          ) : (
            jobs.map(job => (
              <Grid item lg={3} md={4} sm={6} xs={12} key={job.id}>
                <Card sx={{ mb: 2, width: '100%', textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography color="textSecondary">{job.type} | {job.location}</Typography>
                    <Typography>Salary: ₹ {job.salary}</Typography>
                    <Typography>{job.vacancies} Vacancies</Typography>
                    <Box mt={2} display="flex" justifyContent="center" gap={2}>
                      <Button variant="outlined" size="small" onClick={() => handleEditClick(job)}>
                        Edit
                      </Button>
                      <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteJob(job.id)}>
                        Delete
                      </Button>
                      <Button variant="outlined" size="small" onClick={() => fetchApplicants(job.id)}>
                        View Applicants
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
                {selectedJobId === job.id && (
                  <Box mt={2}>
                    {loadingApplicants ? (
                      <CircularProgress />
                    ) : applicants.length === 0 ? (
                      <Typography>No applicants found for this job.</Typography>
                    ) : (
                      applicants.map((applicant) => (
                        <Card key={applicant.id} sx={{ mb: 1 }}>
                          <CardContent>
                            <Typography variant="subtitle1">Name: {applicant.applicantName}</Typography>
                            <Typography variant="body2">Email: {applicant.email}</Typography>
                            <Typography variant="body2">Phone.No.: {applicant.phone}</Typography>
                            <Typography variant="body2">Qualification: {applicant.qualification}</Typography>
                            <Typography variant="body2">Skills: {applicant.skills}</Typography>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </Box>
                )}
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};
