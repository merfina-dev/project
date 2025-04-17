import React, { useState, useEffect } from 'react';
import { TextField, Card, CardContent, Typography, Box, Grid,Dialog, DialogTitle, DialogContent, DialogActions,MenuItem, Select, FormControl, InputLabel,Chip, IconButton, Stack} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

export const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicant, setApplicant] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    skills: '',
    resume: null
  });
  const qualifications = [
    // Engineering
    "B.E. - Computer Science and Engineering",
    "B.E. - Electrical and Electronics Engineering",
    "B.E. - Electronics and Communication Engineering",
    "B.E. - Mechanical Engineering",
    "B.E. - Civil Engineering",
    "B.Tech - Information Technology",
    "B.Tech - Biotechnology",
    "B.Tech - Chemical Engineering",
    "B.Tech - Artificial Intelligence and Data Science",
    // Arts & Science - UG
    "B.Sc - Computer Science",
    "B.Sc - Physics",
    "B.Sc - Chemistry",
    "B.Sc - Mathematics",
    "B.Sc - Biotechnology",
    "B.Sc - Microbiology",
    "B.Sc - Visual Communication",
    "B.A - English",
    "B.A - Tamil",
    "B.A - Economics",
    "B.A - History",
    "B.Com - General",
    "B.Com - Accounting and Finance",
    "BBA - Bachelor of Business Administration",
    "BCA - Bachelor of Computer Applications",
    // PG options
    "M.Sc - Computer Science",
    "M.Sc - Physics",
    "M.Sc - Chemistry",
    "M.A - English",
    "M.A - Tamil",
    "M.Com",
    "MBA - Master of Business Administration",
    "MCA - Master of Computer Applications",
  ];
  const [application, setApplication] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    skills: [],
    newSkill: '',
    resume: null
  });
  

  useEffect(() => {
    axios.get('http://localhost:5000/jobs')
      .then(response => setJobs(response.data))
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setApplicant({
        name: user.fullName || '',
        email: user.email || '',
        phone: '',
        qualification: '',
        skills: '',
        resume: null
      });
    }
  }, [open]);
  
  
  const handleSearch = () => {
    
  };

  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user.name); // Full name from registration


  const filteredJobs = jobs.filter(job =>
    (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (location ? job.location.toLowerCase().includes(location.toLowerCase()) : true) &&
    (jobType ? job.type.toLowerCase() === jobType.toLowerCase() : true)
  );

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicant(prev => ({ ...prev, [name]: value }));
  };
  
  const handleResumeUpload = (e) => {
    setApplicant(prev => ({ ...prev, resume: e.target.files[0] }));
  };
  

  const handleSubmitApplication = () => {
    if (!applicant.name || !applicant.email || !applicant.resume) {
      alert("Please fill all required fields.");
      return;
    }
  
    const finalApplication = {
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      applicantName: applicant.name,
      email: applicant.email,
      phone: applicant.phone,
      qualification: applicant.qualification,
      skills: application.skills,
      resumeName: applicant.resume?.name || '', // only name, no actual file upload support in JSON Server
      appliedAt: new Date().toISOString()
    };
  
    axios.post("http://localhost:5000/applications", finalApplication)
      .then(() => {
        alert("Application submitted successfully!");
        setOpen(false);
  
        // Reset form
        setApplicant({
          name: '',
          email: applicant.email,
          phone: '',
          qualification: '',
          skills: '',
          resume: null
        });
        setApplication({
          skills: [],
          newSkill: ''
        });
      })
      .catch(error => {
        console.error("Error submitting application:", error);
        alert("Failed to submit application.");
      });
  };
  
  
  const handleSkillChange = (e) => {
    setApplication({ ...application, newSkill: e.target.value });
  };
  
  const handleAddSkill = () => {
    const trimmedSkill = application.newSkill.trim();
    if (trimmedSkill && !application.skills.includes(trimmedSkill)) {
      setApplication({
        ...application,
        skills: [...application.skills, trimmedSkill],
        newSkill: ''
      });
    }
  };
  
  const handleDeleteSkill = (skillToDelete) => {
    setApplication({
      ...application,
      skills: application.skills.filter(skill => skill !== skillToDelete)
    });
  };
  
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ height: '400px', width: '100%', position: 'relative', mb: 3,}}>
        <Box sx={{position: 'absolute',height: '100%',width: '100%',backgroundImage: 'url(https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/GTYSdDW/close-up-of-female-hands-typing-on-the-laptop-keyboard_sqhy3apfg_thumbnail-1080_01.png)',backgroundSize: 'cover', backgroundPosition: 'center',zIndex: 0,}}/>
        <Box sx={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 255, 0.3)', zIndex: 0 }} />
        <Box sx={{position: 'relative',display: 'flex',flexDirection: 'column',alignItems: 'center',justifyContent: 'center', height: '100%', zIndex: 1, color: 'white' }}>
          <Typography variant='h4' sx={{ textAlign: 'center', mb: 2 }}>Find Your Perfect <br />Job Match</Typography>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 1,
                border: '4px solid #ccc',
                borderRadius: '25px',
                p: 1,
                width: { xs: '90%', sm: '80%', md: '60%' },
                backgroundColor: 'white',
                zIndex: 1
              }}
            >
              <TextField
                variant="standard"
                placeholder="Title or Company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                InputProps={{ disableUnderline: true, sx: { fontSize: '14px', px: 1 } }}
              />
              <TextField
                variant="standard"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                InputProps={{ disableUnderline: true, sx: { fontSize: '14px', px: 1 } }}
              />
              <FormControl variant="standard" fullWidth sx={{ minWidth: 120 }}>
                <Select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  displayEmpty
                  disableUnderline
                  inputProps={{ sx: { fontSize: '14px', px: 1 } }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Full-Time">Full-Time</MenuItem>
                  <MenuItem value="Part-Time">Part-Time</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                </Select>
              </FormControl>
              <IconButton onClick={handleSearch} size="small">
                <SearchIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

        </Box>
      </Box>
      <Grid container spacing={4} sx={{ width: '100%',display:"flex",justifyContent:"center" }}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
              <Grid item lg={3} md={4} sm={6} xs={12} key={job.id}>
              <Card  sx={{ mb: 2, p: 2, maxWidth: 345,minWidth:300,textAlign:"center"}}>
              <CardContent>
                <Typography variant='h5'>{job.title}</Typography>
                <Typography variant='subtitle1' color='textSecondary'>{job.company} - {job.location}</Typography>
                <Typography variant='body1'>Salary: ₹ {job.salary}</Typography>
                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>{job.type}</Typography>
              </CardContent>
              <Button variant="contained" onClick={() => handleApplyClick(job)}>Apply</Button>
            </Card>
              </Grid>
          ))
        ) : (
          <Typography variant='h6' sx={{ textAlign: 'center', mt: 3 }}>No jobs found</Typography>
        )}
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2,mt:2 }}>
        <TextField name="name" label="Full Name" value={applicant.name} onChange={handleInputChange} fullWidth required/>

        <TextField name="email" label="Email" type='email' value={applicant.email} onChange={handleInputChange} fullWidth required InputProps={{ readOnly: true}} />
        <TextField name="phone" label="Phone Number"  value={applicant.phone} onChange={handleInputChange} fullWidth />
        <FormControl fullWidth margin="normal">
          <InputLabel>Qualification</InputLabel>
          <Select
            value={applicant.qualification}
            onChange={handleInputChange}
            name="qualification"
            label="Qualification"
            required>
              {qualifications.map((qual, index) => (
                <MenuItem key={index} value={qual}>{qual}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField  label="Add Skill"  value={application.newSkill}  onChange={handleSkillChange}  fullWidth  margin="normal" required />
        <Button variant="outlined" onClick={handleAddSkill} sx={{ mt: 1, mb: 2,width:"103px" }}>
          Add Skill
        </Button>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {application.skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => handleDeleteSkill(skill)}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitApplication}>Submit</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
