(function($) {
  "use strict";

  // Spinner
  var spinner = function() {
    setTimeout(function() {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1);
  };
  spinner();


  // Initiate the wowjs
  new WOW().init();


  // Sticky Navbar
  $(window).scroll(function() {
    if ($(this).scrollTop() > 300) {
      $('.sticky-top').css('top', '0px');
    } else {
      $('.sticky-top').css('top', '-100px');
    }
  });


  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 300) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function() {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });


  // Header carousel
  $(".header-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    items: 1,
    dots: true,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>'
    ]
  });


  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    center: true,
    margin: 24,
    dots: true,
    loop: true,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      992: {
        items: 3
      }
    }
  });

})(jQuery);

let allJobsData = null;



async function fetchJobsData() {
  try {
    const response = await fetch("https://gist.githubusercontent.com/Kamlesh0007/b4623fe848d16899a089a1bd78b28852/raw/37da563536bd1afd27443b85ae46ca0baf903712/jobs.json");
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

async function renderJobs(mode = null) {
  const jobsContainer = document.getElementById('jobs-container');
  if (jobsContainer) {
    jobsContainer.innerHTML = ''; // Clear previous content
  }
  if (!allJobsData) {
    allJobsData = await fetchJobsData(); // Fetch data from API only if it's not already fetched
  }

  const data = allJobsData;
  if (jobsContainer) {
    if (mode && mode.toLowerCase() === 'featured') {
      // If mode is "featured", render all jobs
      data.forEach(job => {
        const jobItem = createJobItem(job);
        jobsContainer.appendChild(jobItem);
      });
    } else if (mode) {
      const filteredJobs = data.filter(job => job.mode.toLowerCase() === mode.toLowerCase());

      filteredJobs.forEach(job => {
        const jobItem = createJobItem(job);
        jobsContainer.appendChild(jobItem);
      });
    } else {
      // If mode is not specified, render all jobs
      data.forEach(job => {
        const jobItem = createJobItem(job);
        jobsContainer.appendChild(jobItem);
      });
    }
  }
}


function createJobItem(job) {
  const jobItem = document.createElement('div');
  jobItem.classList.add('job-item', 'p-4', 'mb-4');
  jobItem.setAttribute('id', `job-${job.id}`);
  jobItem.dataset.jobId = job.id;

  // Create job item HTML dynamically using job data

  jobItem.innerHTML = `
    <div class="row g-4">
      <div class="col-sm-12 col-md-8 d-flex align-items-center">
        <img class="flex-shrink-0 img-fluid border rounded" src="${job.image_url}" alt="Company Logo" style="width: 80px; height: 80px;">
        <div class="text-start ps-4">
          <h5 class="mb-3">${job.job_title}</h5>
          <span class="text-truncate me-3"><i class="fa fa-map-marker-alt text-primary me-2"></i>${job.job_location}, Japan</span>
          <span class="text-truncate me-3"><i class="far fa-clock text-primary me-2"></i>${job.mode}</span>
          <span class="text-truncate salary me-0"><i class="far fa-money-bill-alt text-primary me-2"></i>${job.salary}</span>
        </div>
      </div>
      <div class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
        <div class="d-flex mb-3">
          <a class="btn btn-light btn-square me-3" href=""><i class="far fa-heart text-primary"></i></a>
          <button class="btn btn-primary apply-button" data-job-id="${job.id}">Apply Now</button>
        </div>
        <small class="text-truncate"><i class="far fa-calendar-alt text-primary me-2"></i>${job.date}</small>
      </div>
    </div>
  `;

  // Add event listener to the apply button
  const applyButton = jobItem.querySelector('.apply-button');
  applyButton.addEventListener('click', function(event) {
    event.preventDefault();
    const jobId = applyButton.dataset.jobId; // Retrieve job ID from data attribute
    console.log(`Apply button clicked for job ID: ${jobId}`);
    const job = getJobDetailsById(jobId);
    if (job) {
      window.location.href = `/job-detail.html?id=${jobId}`;

    } else {
      console.error('Job not found');
      // Handle the case where job details are not found
    }
  });
  return jobItem;
}

window.addEventListener('load', () => {
  renderJobs();
});



const searchButton = document.querySelector('#search-button');
if (searchButton) {
  searchButton.addEventListener('click', async function() {
    const categorySelect = document.querySelector('#category-select');
    const locationSelect = document.querySelector('#location-select');
    const selectedCategory = categorySelect.value;
    const selectedLocation = locationSelect.value;


    // Call the fetchJobsBySearch function with selected category and location
    const jobData = await fetchJobsBySearch(selectedCategory, selectedLocation);

    // Render the fetched job data
    renderSearchJobs(jobData);
  })
}

async function fetchJobsBySearch(category, location) {
  try {
    // Perform API call to fetch job data based on selected category and location
    console.log(category, location);
    // If both category and location are empty, return an error message
    if (!category && !location) {
      return "Please select category and location";
    }
    const response = await fetch("https://gist.githubusercontent.com/Kamlesh0007/b4623fe848d16899a089a1bd78b28852/raw/37da563536bd1afd27443b85ae46ca0baf903712/jobs.json");
    const data = await response.json();

    // Filter job data based on selected category and location
    const filteredJobs = data.filter(job => {
      const categoryMatch = !category || job.category.toLowerCase().includes(category.toLowerCase());
      const locationMatch = !location || job.job_location.toLowerCase() === location.toLowerCase();
      return categoryMatch && locationMatch;
    });
    console.log(filteredJobs);
    // If no results found, return a message
    if (filteredJobs.length === 0) {
      return "No jobs found for the selected criteria";
    }

    return filteredJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return []; // Return an empty array in case of error
  }
}


function renderSearchJobs(jobs) {
  const jobsContainer = document.getElementById('jobs-container-by-search');
  jobsContainer.innerHTML = ''; // Clear previous content

  if (Array.isArray(jobs) && jobs.length > 0) {
    jobs.forEach(job => {
      const jobItem = createJobItem(job);
      jobsContainer.appendChild(jobItem);

    })


  } else {
    const messageElement = document.createElement("div");
    messageElement.textContent = jobs;
    messageElement.classList.add("error-message");
    jobsContainer.appendChild(messageElement);
  }
}



// Function to handle click event on job items
function handleJobItemClick(job) {
  console.log(job)

  const jobDetailContainer = document.getElementById('job-detail-container');
  console.log(jobDetailContainer)
  if (jobDetailContainer) {
    jobDetailContainer.innerHTML = ''; // Clear previous content
  }

  const jobDetailContent = `
    <div class="container">
      <div class="row gy-5 gx-4">
        <div class="col-lg-8">
          <div class="d-flex align-items-center mb-5">
            <img class="flex-shrink-0 img-fluid border rounded" src="${job.image_url}" alt="" style="width: 80px; height: 80px;">
            <div class="text-start ps-4">
              <h3 class="mb-3">${job.job_title}</h3>
              <span class="text-truncate me-3"><i class="fa fa-map-marker-alt text-primary me-2"></i>${job.job_location}</span>
              <span class="text-truncate me-3"><i class="far fa-clock text-primary me-2"></i>${job.mode}</span>
              <span class="text-truncate salary me-0"><i class="far fa-money-bill-alt text-primary me-2"></i>${job.salary}</span>
            </div>
          </div>

          <div class="mb-5">
            <h4 class="mb-3">Job description</h4>
            <p>${job.job_description}</p>
          <h4 class="mb-3">Responsibility</h4>
          <p>Magna et elitr diam sed lorem. Diam diam stet erat no est est. Accusam sed lorem stet voluptua sit sit
            at stet consetetur, takimata at diam kasd gubergren elitr dolor</p>
          <ul class="list-unstyled">
            <li><i class="fa fa-angle-right text-primary me-2"></i>Dolor justo tempor duo ipsum accusam</li>
            <li><i class="fa fa-angle-right text-primary me-2"></i>Elitr stet dolor vero clita labore gubergren</li>
            <li><i class="fa fa-angle-right text-primary me-2"></i>Rebum vero dolores dolores elitr</li>
            <li><i class="fa fa-angle-right text-primary me-2"></i>Est voluptua et sanctus at sanctus erat</li>
            <li><i class="fa fa-angle-right text-primary me-2"></i>Diam diam stet erat no est est</li>
          </ul>
          <h4 class="mb-3">Qualifications</h4>
          <p>Magna et elitr diam sed lorem. Diam diam stet erat no est est. Accusam sed lorem stet voluptua sit sit
            at stet consetetur, takimata at diam kasd gubergren elitr dolor</p>
          <ul class="list-unstyled">
            <li><i class="fa fa-angle-right text-primary me-2"></i>Dolor justo tempor duo ipsum accusam</li>
            <li><i class="fa fa-angle-right text-primary me-2"></i>Elitr stet dolor vero clita labore gubergren</li>
            <li><i class="fa fa-angle-right text-primary me-2"></i>Rebum vero dolores dolores elitr</li>
            <li><i class="fa fa-angle-right text-primary me-2"></i>Est voluptua et sanctus at sanctus erat</li>
            <li><i class="fa fa-angle-right text-primary me-2"></i>Diam diam stet erat no est est</li>
          </ul>
          </div>

          <!-- Apply Form section -->
          <div class="">
            <h4 class="mb-4">Apply For The Job</h4>
            <form>
              <div class="row g-3">
                <div class="col-12 col-sm-6">
                  <input type="text" class="form-control" placeholder="Your Name">
                </div>
                <div class="col-12 col-sm-6">
                  <input type="email" class="form-control" placeholder="Your Email">
                </div>
                <div class="col-12 col-sm-6">
                  <input type="text" class="form-control" placeholder="Portfolio Website">
                </div>
                <div class="col-12 col-sm-6">
                  <input type="file" class="form-control bg-white">
                </div>
                <div class="col-12">
                  <textarea class="form-control" rows="5" placeholder="Coverletter"></textarea>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary w-100" type="submit">Apply Now</button>
                </div>
              </div>
            </form>
          </div>

        </div>

        <div class="col-lg-4">
          <div class="bg-light rounded p-5 mb-4 wow slideInUp" data-wow-delay="0.1s">
            <h4 class="mb-4">Job Summary</h4>
            <p><i class="fa fa-angle-right text-primary me-2"></i>Published On: ${job.date}</p>
            <p><i class="fa fa-angle-right text-primary me-2"></i>Vacancy: 123</p>
            <p><i class="fa fa-angle-right text-primary me-2"></i>Job Nature: ${job.mode}</p>
            <p><i class="fa fa-angle-right text-primary me-2"></i>Salary: ${job.salary}</p>
            <p><i class="fa fa-angle-right text-primary me-2"></i>Location: ${job.job_location}</p>
            <p class="m-0"><i class="fa fa-angle-right text-primary me-2"></i>Date Line: ${job.date}</p>
          </div>
          <div class="bg-light rounded p-5 wow slideInUp" data-wow-delay="0.1s">
            <h4 class="mb-4">Company Detail</h4>
          <p class="m-0">Ipsum dolor ipsum accusam stet et et diam dolores, sed rebum sadipscing elitr vero dolores.
          Lorem dolore elitr justo et no gubergren sadipscing, ipsum et takimata aliquyam et rebum est ipsum lorem
          diam. Et lorem magna eirmod est et et sanctus et, kasd clita labore.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  jobDetailContainer.innerHTML = jobDetailContent;

}





async function getJobDetailsById(jobId) {
  try {
    const response = await fetch("https://gist.githubusercontent.com/Kamlesh0007/b4623fe848d16899a089a1bd78b28852/raw/37da563536bd1afd27443b85ae46ca0baf903712/jobs.json");
    const data = await response.json();
    console.log(data)
    return data.find(job => job.id === jobId);
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }

}





document.addEventListener('DOMContentLoaded', async function() {
  if (window.location.pathname.endsWith('job-detail.html')) {
    // Extract job ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    // Check if jobId is valid
    if (jobId) {
      // Get the job details using the jobId
      const job = await getJobDetailsById(jobId);

      if (job) {
        console.log(job);
        // Call function to display job detail content
        handleJobItemClick(job);
      } else {
        console.error('Job not found');
        // Handle the case where job details are not found
      }
    } else {
      console.error('Job ID not provided in the URL');
      // Handle the case where job ID is not provided in the URL

    }
  }
  const parent = document.getElementById('google_translate_element');
  console.log(parent);
  if (parent) {
    // Find the parent element containing the "Powered by" text
    const poweredByText = parent.firstChild;
    console.log(poweredByText)
    // Check if the parent element exists
    if (poweredByText) {

      poweredByText.textContent = '';
    }
  }
});







// Function to initialize Google Translate widget
function initializeGoogleTranslate() {
  new google.translate.TranslateElement({ pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, includedLanguages: 'en,ja' }, 'google_translate_element');
}

// Function to load Google Translate script asynchronously
function loadGoogleTranslateScript() {
  const script = document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=initializeGoogleTranslate';
  document.head.appendChild(script);
}

// Retry loading Google Translate script if it fails
function retryLoadGoogleTranslate(maxAttempts, interval) {
  let attempts = 0;
  console.log("called")
  function tryLoadGoogleTranslate() {
    if (typeof google !== 'undefined' && google.translate) {
      // Google Translate is already loaded, no need to retry
      return;
    }

    if (attempts < maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts} to load Google Translate script...`);
      loadGoogleTranslateScript();
      setTimeout(tryLoadGoogleTranslate, interval);
    } else {
      console.error(`Failed to load Google Translate after ${maxAttempts} attempts.`);
    }
  }

  tryLoadGoogleTranslate();
}

// Call retryLoadGoogleTranslate to start retry mechanism
retryLoadGoogleTranslate(5, 3000); // Retry 5 times with a 3-second interval



//google trans 

$('document').ready(function() {


  // RESTYLE THE DROPDOWN MENU
  $('#google_translate_element').on("click", function() {

    // Change font family and color
    $("iframe").contents().find(".goog-te-menu2-item div, .goog-te-menu2-item:link div, .goog-te-menu2-item:visited div, .goog-te-menu2-item:active div, .goog-te-menu2 *")
      .css({
        'color': '#544F4B',
        'font-family': 'Roboto',
        'width': '100%'
      });
    // Change menu's padding
    $("iframe").contents().find('.goog-te-menu2-item-selected').css('display', 'none');

    // Change menu's padding
    $("iframe").contents().find('.goog-te-menu2').css('padding', '0px');

    // Change the padding of the languages
    $("iframe").contents().find('.goog-te-menu2-item div').css('padding', '20px');

    // Change the width of the languages
    $("iframe").contents().find('.goog-te-menu2-item').css('width', '100%');
    $("iframe").contents().find('td').css('width', '100%');

    // Change hover effects
    $("iframe").contents().find(".goog-te-menu2-item div").hover(function() {
      $(this).css('background-color', '#4385F5').find('span.text').css('color', 'white');
    }, function() {
      $(this).css('background-color', 'white').find('span.text').css('color', '#544F4B');
    });

    // Change Google's default blue border
    $("iframe").contents().find('.goog-te-menu2').css('border', 'none');

    // Change the iframe's box shadow
    $(".goog-te-menu-frame").css('box-shadow', '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.3)');



    // Change the iframe's size and position?
    $(".goog-te-menu-frame").css({
      'height': '100%',
      'width': '100%',
      'top': '0px'
    });
    // Change iframes's size
    $("iframe").contents().find('.goog-te-menu2').css({
      'height': '100%',
      'width': '100%'
    });
  });
});
