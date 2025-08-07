import factoryBuild from './factoryBuild';

export const Company = () => factoryBuild({ baseTable: 'companies' });
export const JobApplication = () => factoryBuild({ baseTable: 'job_applications' });

const Models = {
  Company,
  JobApplication
};

export default Models;