Opportunities in Japan
Introduction
This project aims to provide information about job opportunities in Japan. It includes a web application where users can search for available jobs, view job details, and apply for them.

Source Code
The source code is organized as follows:

index.html: The main HTML file containing the layout and structure of the web application.
style.css: The CSS file responsible for styling the web application.
main.js: The JavaScript file containing the logic for fetching job data, rendering job items, handling user interactions, and navigating between pages.
job-detail.html: The HTML file for displaying detailed information about a specific job.
job-detail.js: The JavaScript file containing the logic for displaying job details and handling user interactions on the job detail page.


APIs Used
The project utilizes the following APIs:

Job Data API: An API that provides job listings and details for various positions available in Japan. It is accessed through the fetchJobsBySearch() function in api.js.
Google Translate API: Used to enable multilingual support on the web application. It translates content into Japanese using the googleTranslateElementInit() function.

Usage

To use the web application:

Open the index.html file in a web browser.
Use the search functionality to find job listings based on category and location.
Click on a job listing to view detailed information.
Apply for a job by filling out the application form on the job detail page.


