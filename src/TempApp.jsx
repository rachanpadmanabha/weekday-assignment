import { useState, useEffect } from "react";
import JobCard from "./JobCard"; // Assume you have a JobCard component
import "./App.css";

// App component
const App = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const fetchJobs = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const body = JSON.stringify({
        limit: 9,
        offset: page * 9, // Use the current page value
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body,
      };

      // Increment page before making the API call
      setPage((prevPage) => prevPage + 1); // Increment page

      const response = await fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        requestOptions
      );
      const data = await response.json();
      setJobs((prevJobs) => [...prevJobs, ...data.jdList]); // Append new jobs to existing jobs
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false); // Ensure loading state is set to false in case of error
    }
  };
  useEffect(() => {
    // Fetch initial set of jobs
    fetchJobs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 100; // Adjust this threshold as needed
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const documentHeight = document.documentElement.offsetHeight;

      if (documentHeight - scrollPosition < threshold) {
        // User has scrolled close to the bottom of the page
        if (!loading) {
          setLoading(true);
          fetchJobs();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, page]);

  return (
    <div>
      <h1>Job Listings</h1>
      <div className="job-wrapper">
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default App;
