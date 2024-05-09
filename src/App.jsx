import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Typography, TextField, Select, MenuItem, Checkbox, FormControlLabel, Box, FormControl, Grid, InputLabel } from "@mui/material";
import JobCard from "./JobCard";
import Loader from "./Loader";
import "./App.css"
import fetchJobs, { cancelFetchJobs } from "./fetchJobsService";

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // State variables for filters
  const [locationFilter, setLocationFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  const fetchData = async () => {
    try {
      const { jdList, totalCount: fetchedTotalCount } = await fetchJobs(page);
      setJobs((prevJobs) => [...prevJobs, ...jdList]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(jobs.length + jdList.length < fetchedTotalCount);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    return () => cancelFetchJobs();
  }, []);
  const isSalaryInRange = (minSalary, maxSalary, minimum) => {
    if (minSalary === null || maxSalary === null || minimum === null) {
      return false;
    }
    const parsedMinimum = parseFloat(minimum);
    return minSalary >= parsedMinimum && maxSalary <= parsedMinimum + 10;
  };
  console.log("salaryFilter", salaryFilter)
  const filteredJobs = jobs.filter((job) => {

    if (roleFilter && job.jobRole.toLowerCase() !== roleFilter.toLowerCase()) {
      return false;
    }

    if (locationFilter && !job.location.toLowerCase().includes(locationFilter.toLowerCase()) && locationFilter !== "remote") {
      return false;
    }

    if (salaryFilter && !isSalaryInRange(job.minJdSalary, job.maxJdSalary, salaryFilter)) {
      return false;
    }

    if (companyFilter && !job.companyName.toLowerCase().includes(companyFilter.toLowerCase())) {
      return false;
    }

    return true;
  });




  return (
    <div className="app">
      <Typography variant="h2">Job Listings</Typography>

      <Grid container spacing={2} alignItems="center" justifyContent={"center"}>
        <Grid item>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="roles">Roles</InputLabel>
              <Select
                labelid="roles"
                id="roles-id"
                value={roleFilter}
                label="Roles"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="Frontend">Frontend</MenuItem>
                <MenuItem value="Backend">Backend</MenuItem>
                <MenuItem value="iOS">iOS</MenuItem>
                <MenuItem value="Android">Android</MenuItem>
                <MenuItem value="React Native">React Native</MenuItem>
                <MenuItem value="Tech Lead">Tech Lead</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item>
          <TextField
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Checkbox checked={locationFilter === "Remote"} onChange={(e) => setLocationFilter(e.target.checked ? "Remote" : "")} />}
            label="Remote"
          />
        </Grid>
        <Grid item>
          <Box sx={{ minWidth: 190 }}>
            <FormControl fullWidth>
              <InputLabel id="salaries">Minimum Base Pay</InputLabel>
              <Select
                labelid="salaries"
                id="salaries-id"
                value={salaryFilter}
                label="Minimum Base Pay"
                onChange={(e) => setSalaryFilter(e.target.value)}
              >
                <MenuItem value="">All Salaries</MenuItem>
                <MenuItem value="10">10LPA</MenuItem>
                <MenuItem value="20">20LPA</MenuItem>
                <MenuItem value="30">30LPA</MenuItem>
                <MenuItem value="40">40LPA</MenuItem>
                <MenuItem value="50">50LPA</MenuItem>
                <MenuItem value="60">60LPA</MenuItem>
                <MenuItem value="70">Above 70LPA</MenuItem>

              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item>
          <TextField
            labelid="company-name"
            placeholder="Company Name"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          />
        </Grid>
      </Grid>


      <InfiniteScroll
        dataLength={filteredJobs.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<Loader />}
        endMessage={<Typography variant="subtitle1">Yay! You have seen it all</Typography>}
      >
        <div className="job-wrapper">
          {filteredJobs.map((job) => (
            <JobCard key={job.jdUid} job={job} />
          ))}
        </div>
      </InfiniteScroll>
      {error && <Typography color="error">Error: {error}</Typography>}
    </div>
  );
};

export default App;
