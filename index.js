const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');

const scrapeJobs = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const jobs = [];

        $('.job-bx').each((index, element) => {
            const jobTitle = $(element).find('h2 a').text().trim();
            const companyName = $(element).find('.company-name').text().trim();
            const location = $(element).find('.location').text().trim();
            const jobType = $(element).find('.job-type').text().trim() || 'Not Specified';
            const postedDate = $(element).find('.posted-date').text().trim();
            const jobDescription = $(element).find('.job-desc').text().trim();

            jobs.push({
                JobTitle: jobTitle,
                CompanyName: companyName,
                Location: location,
                JobType: jobType,
                PostedDate: postedDate,
                JobDescription: jobDescription,
            });
        });

        const worksheet = xlsx.utils.json_to_sheet(jobs);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Tech Jobs');
        xlsx.writeFile(workbook, 'TechJobs.xlsx');
        console.log('Data has been written to TechJobs.xlsx');
    } catch (error) {
        console.error('Error scraping jobs:', error.message);
    }
};

const url = 'https://www.timesjobs.com/candidate/job-search.html?searchType=Home_Search&from=submit&asKey=OFF&txtKeywords=&cboPresFuncArea=35';
scrapeJobs(url);
