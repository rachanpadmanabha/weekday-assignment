import PropTypes from "prop-types";
import "./JobCard.css";
import ClockSvg from "./assets/sand-clock.svg";
import { capitalizeWords } from "./Utils";
import { yellow } from "@mui/material/colors";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
const JobCard = ({ job }) => {
  if (!job) {
    return <div>No job data available</div>;
  }

  const {
    companyName,
    logoUrl,
    jobRole,
    location,
    minJdSalary,
    maxJdSalary,
    salaryCurrencyCode,
    jobDetailsFromCompany,
    minExp,
  } = job;

  const renderSalary = () => {
    return (
      <div className="salary">
        Estimated Salary{" "}
        <span>
          :
          {minJdSalary !== null && maxJdSalary !== null && salaryCurrencyCode
            ? `₹${minJdSalary} - ${maxJdSalary} LPA ✅` //null conditional rendering for salary
            : "NA"}
        </span>
      </div>
    );
  };

  const renderExperience = () => {
    return (
      //null conditional rendering for experience
      <div className="experience">
        <div className="experience-title">Minimum Experience:</div>
        <span> {minExp !== null ? `${minExp} years` : "NA"}</span>
      </div>
    );
  };

  return (
    <div className="job-card">
      <div className="posted-on">
        <img src={ClockSvg} alt="sand-clock" />
        Posted 10 days ago
      </div>
      <div className="company-details">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={companyName}
            className="company-logo" //company-logo  in given example the logo wasn't looking right
            sizes="20" // so i made it circle gave it boundary for better ui
            aria-label={`${companyName} logo`}
          />
        )}
        <div className="details">
          {companyName && <div className="company">{companyName}</div>}
          {jobRole && (
            <div className="job-role" aria-label="Job role">
              {`${capitalizeWords(jobRole)} Engineer`}
            </div>
          )}
          {location && (
            <div className="location">{capitalizeWords(location)}</div>
          )}
        </div>
      </div>
      {renderSalary()}
      <div className="about-company">About Company:</div>
      <div className="about-us">About Us</div>
      {jobDetailsFromCompany && (
        <div className="description">
          {jobDetailsFromCompany}
          <div className="view-job">View Job</div>
        </div>
      )}
      {renderExperience()}
      <button
        className="easy-apply-button"
        aria-label="Easy apply"
        onClick={() => window.open("https://www.weekday.works/", "_blank")}
      >
        <ElectricBoltIcon sx={{ color: yellow[500] }} />
        Easy Apply
      </button>
      <button
        className="referral-button"
        aria-label="Unlock referral asks"
        onClick={() => window.open("https://kp-rachan.web.app/", "_blank")}
      >
        <img
          src="https://xsgames.co/randomusers/avatar.php?g=male"
          alt="male-avatar"
        />
        <img
          src="https://xsgames.co/randomusers/avatar.php?g=female"
          alt="female-avatar"
        />
        Unlock referral asks
      </button>
    </div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    companyName: PropTypes.string,
    logoUrl: PropTypes.string,
    jobRole: PropTypes.string,
    location: PropTypes.string,
    minJdSalary: PropTypes.number,
    maxJdSalary: PropTypes.number,
    salaryCurrencyCode: PropTypes.string,
    jobDetailsFromCompany: PropTypes.string,
    minExp: PropTypes.number,
  }).isRequired,
};

export default JobCard;
