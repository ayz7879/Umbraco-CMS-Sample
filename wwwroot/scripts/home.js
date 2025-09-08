//disable go button when input character length is less than 2
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("InputSearch");
    const button = document.querySelector(".search-button");
    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Optional: prevent default Enter behavior
            document.querySelector(".search-button").click(); // Trigger button click
        }
    });
    // Disable button initially
    button.disabled = true;

    input.addEventListener("input", function () {
        if (input.value.trim().length > 2) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
});
//This method for Go button on index page .It will redirect to FindARunner and RaceCalendar based on ruuner and event
function redirectBasedOnSelection() {
    const searchType = document.getElementById("searchType").value;
    const inputValue = document.getElementById("InputSearch").value.trim();

    if (!inputValue) {
        alert("Please enter a search term.");
        return;
    }

    let url = "";

    if (searchType === "runner") {
        url = `Runners/FindARunner?name=${encodeURIComponent(inputValue)}`;
    } else if (searchType === "event") {
        url = `Races/RaceCalendar?name=${encodeURIComponent(inputValue)}`;
    }

    window.open(url, "_blank");
}

//This method if user picture not exist then firstname and lastname first character will display.
function handleImageError(imgElement) {
    const container = imgElement.parentElement;
    const nameIcon = container.querySelector('.name-icon');

    imgElement.style.display = 'none';
    if (nameIcon) {
        nameIcon.style.display = 'block';
    }
}
//This method check profile image on load runner
function handleImageLoad(imgElement) {
    const container = imgElement.parentElement;
    const nameIcon = container.querySelector('.name-icon');


    if (imgElement.src.includes('/images/member-pics/default.jpg')) {
        imgElement.style.display = 'none';
        if (nameIcon) {

            nameIcon.classList.add('name-icon-block');
        }
    } else {
        imgElement.style.display = 'block';
        if (nameIcon) {
            nameIcon.style.display = 'none';
        }
    }
}
//This method redirect race Deatil
function showRaceDetails(url) {
    window.open(url, '_blank');
}
//This method redirect runner Deatil
function showRunnerDetails(url) {
    window.open(url, '_blank');
}
//This method find text color according to rank
var getRankFontColor = function (rank) {
    const colorMap = {
        // Intermediate ranks
        'Intermediate 1': '#ffffff',
        'Intermediate 2': '#ffffff',
        'Intermediate 3': '#ffffff',
        'Intermediate 4': '#ffffff',

        // Advanced ranks
        'Advanced 1': '#292D32',
        'Advanced 2': '#292D32',
        'Advanced 3': '#292D32',
        'Advanced 4': '#292D32',

        // Expert ranks
        'Expert 1': '#292D32',
        'Expert 2': '#292D32',
        'Expert 3': '#292D32',
        'Expert 4': '#292D32',

        // Elite ranks
        'Elite 1': '#ffffff',
        'Elite 2': '#ffffff',
        'Elite 3': '#ffffff',
        'Elite 4': '#ffffff',

        'Novice': '#ffffff'
    };

    return colorMap[rank] || '##ffffff';
};
function handleImageError(imgElement) {
    const container = imgElement.parentElement;
    const fallback = container.querySelector('.error-img');
    imgElement.style.display = 'none';
    if (fallback) {
        fallback.style.display = 'flex';
    }
}
$(document).ready(function () {

    const input = document.getElementById('InputSearch');
    const clearBtn = document.getElementById('clearBtn');
    input.addEventListener('input', () => {
        clearBtn.style.display = input.value ? 'block' : 'none';
    });

    input.addEventListener('focus', () => {
        if (input.value) {
            clearBtn.style.display = 'block';
        }
    });
    $('#clearBtn').on('click', function () {
        $(this).prev('input').val('').focus();
        $(this).hide(); // Optional: hide the cross after clearing
        const button = document.querySelector(".search-button");
        button.disabled = true;

    });

    let delayTimer;
    let currentRequest = null; // Track current AJAX request

    BindSimilarArticlesWithTags();
    $('#InputSearch').on('focus click', function () {
        const query = $(this).val().trim();
        if (query.length > 2 && $('.search-dropdown').is(':hidden')) {
            $(this).trigger('input'); // Reuse existing logic to show dropdown
        }
    });
    //Home page runner and even serach
    $('#InputSearch').on('input', function () {
        const query = $(this).val().trim();
        const searchType = $('.search-select').val(); // Get selected search type

        // Clear previous timer
        clearTimeout(delayTimer);

        // Cancel previous request if still pending
        if (currentRequest && currentRequest.readyState !== 4) {
            currentRequest.abort();
        }

        if (query.length > 2) {
            $('.search-dropdown').empty().show();
            $('.search-dropdown').html(`<div class="search-dropdown-item"><span style="color:black">${translatedText.loading}</span></div>`).show();

            delayTimer = setTimeout(() => {
                // Determine API endpoint based on search type
                let apiUrl = '/api/runner/findByName';
                let requestData = {
                    name: query

                };

                // Modify API call based on search type
                switch (searchType) {
                    case 'event':
                        apiUrl = '/api/race/searcheventorracebyname';
                        requestData = {
                            searchTerms: query,
                            language:translatedText.language

                        };
                        break;

                    // Default is runner search
                }

                currentRequest = $.ajax({
                    url: apiUrl,
                    method: 'POST',
                    data: requestData,
                    timeout: 5000, // 5 second timeout
                    success: function (data) {

                        let html = '';
                        if (data && data.results && data.results.length > 0) {
                            html = `<div class="show-more" onclick="redirectBasedOnSelection()">${translatedText.showmoreresult}</div>`;
                            data.results.forEach(item => {
                                html += generateSearchResultHTML(item, searchType, query);
                            });
                        } else {
                            const message = searchType === 'event'
                                ? translatedText.noeventfound
                                : translatedText.norunnerfound;

                            html = `<div class="search-dropdown-item" style="color:black">${message}.</div>`;
                        }
                        $('.search-dropdown').html(html).show();
                    },
                    error: function (xhr, status, error) {
                        if (status !== 'abort') { // Don't show error for aborted requests
                            $('.search-dropdown').html('<div class="search-dropdown-item">Error fetching results.</div>').show();
                        }
                    },
                    complete: function () {
                        currentRequest = null;
                    }
                });
            }, 200); // Reduced delay for faster response
        } else {
            $('.search-dropdown').hide();
        }
    });


    const countryFlagCache = {};
    const defaultFlag = "/images/public/Logo_itra_V N.png";
    //For flag display
    function getCountryFlagWithCache(code) {
        if (!code || typeof code !== "string" || code.trim() === "") {
            return defaultFlag;
        }

        const key = code.toLowerCase();

        // Check cache
        if (countryFlagCache[key]) {
            return countryFlagCache[key];
        }

        // Construct the flag path
        const flagPath = `/images/CountryFlags/${key}.svg`;

        // Store in cache
        countryFlagCache[key] = flagPath;

        return flagPath;
    }

    // Function to generate HTML based on search type
     

    function highlightMatch(text, query) {
        if (!query) return text;
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.replace(regex, (match) =>
            `<span class="highlight">${match}</span>`
        );
    }
   
    function generateSearchResultHTML(item, searchType, searchText) {
       
        switch (searchType) {
           
            case 'runner':
                const fontColor = getRankFontColor(item.piIndex);
                const initials = `${(item.firstName || '').charAt(0).toUpperCase()}${(item.lastName || '').charAt(0).toUpperCase()}`;

                const firstName = highlightMatch(item.firstName || '', searchText);
                const lastName = highlightMatch(item.lastName || '', searchText);
         
               

                return `                            
			<div class="search-dropdown-item" title="${item.firstName} ${item.lastName}" onclick="showRunnerDetails('/RunnerSpace/${item.lastName}.${item.firstName}/${item.runnerId}')" >
				<div class="box-inner">
					<div class="user-name-img">
						<img src="${item.profilePic}" onerror="handleImageError(this)" onload="handleImageLoad(this)" alt="" class="profile-img">
						<div class="name-icon">${initials}</div>
						<p class="name"><span>${firstName}</span> ${lastName}</p>
					</div>
					<div class="country-age-boxs">
						<div class="user-country">
							<img src="${item.code || '/default-flag.png'}" alt="" class="country-flag" onerror="this.src='/default-flag.png'">
							<p class="country">${item.nationality}</p>
						</div>
						<div class="age-group">
							<p class="age">${translatedText.ageGroup}: <span>${item.ageGroup}</span></p>
						</div>
					</div>
					<div class="runner-badge" style="background-color:${item.colorCode}">
						<span class="badge-number" style="color:${fontColor}">${item.pi || ''}</span>
						<div class="badge-divider" style="background-color:${fontColor}"></div>
						<span class="badge-rank" style="color:${fontColor}">${item.piIndex || ''}</span>
					</div>
				</div>
			</div>`;

            case 'event':
                const countryCode = item.countryCode || '';
                const flagSrc = getCountryFlagWithCache(countryCode);
                const eventName = highlightMatch(item.fullEventName || '', searchText);
              

                return `
<div class="search-dropdown-item" title="${item.fullEventName} ${item.city || ''}, ${item.alphacode || ''}" onclick="showRaceDetails('/Races/RaceDetails/${item.raceYearId}')">
	<div class="box-inner">
		<div class="events-name">${eventName}</div>
		<div class="with-flag-name">
			<img src="${flagSrc}" alt="">
			<span class="flag-name">${item.city}, ${item.alphacode}</span>
		</div>
	</div>
</div>`;

            default:
                return `<div class="search-dropdown-item">Unknown search type</div>`;
        }
    }
   
    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
    // Update placeholder text based on search type
    $('.search-select').on('change', function () {
        const searchType = $(this).val();
        const placeholders = {
            'runner': translatedText.searchrunner,
            'event': translatedText.searchevent,
            'location': 'Search for location...'
        };
        
        const placeholderDecoded = decodeHtml(placeholders[searchType] || 'Search...');
        $('#InputSearch').attr('placeholder', placeholderDecoded);
       

     
        // Clear current search and hide dropdown
        $('#InputSearch').val('');
        $('.search-dropdown').hide();
    });

    // Clear button
    $('#clearBtn').on('click', function () {
        $('#InputSearch').val('');
        $('.search-dropdown').hide();

        // Cancel any pending request
        if (currentRequest && currentRequest.readyState !== 4) {
            currentRequest.abort();
        }
        clearTimeout(delayTimer);
    });

    // Hide dropdown on click outside
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.search-box, .search-dropdown').length) {
            $('.search-dropdown').hide();
        }
    });

    // Handle Enter key press
    $('#InputSearch').on('keypress', function (e) {
        if (e.which === 13) { // Enter key
            e.preventDefault();
            // Trigger search or navigate to first result
            const firstResult = $('.search-dropdown-item').first();
            if (firstResult.length && firstResult.attr('onclick')) {
                eval(firstResult.attr('onclick'));
            }
        }
    });


});
//Trim article description
function stripHtml(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    var text = div.textContent || div.innerText || "";
    return text.length > 120 ? text.substring(0, 117) + "..." : text;
}
//Format for latest article date.
function formatPostDate(dateStr, lang) {
    const date = new Date(dateStr);
    const parts = new Intl.DateTimeFormat(lang, {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }).formatToParts(date);

    var day = parts.find(p => p.type === 'day')?.value;
    var month = parts.find(p => p.type === 'month')?.value.replace('.', '');
    var year = parts.find(p => p.type === 'year')?.value;

    month = month.charAt(0).toUpperCase() + month.slice(1);

    return `${month} ${day}, ${year}`;
}

//This method is displaying  latest article on home page
function BindSimilarArticlesWithTags() {


    var requestData = {

    };





    $.ajax({
        url: '/NewsArticle/GetLatestArticles',
        type: 'POST',
        data: requestData,
        success: function (response) {

            if (response.length > 0) {
                const container = $('#latest-news-container'); // updated selector
                container.empty(); // clear old hardcoded items

                $.each(response, function (index, item) {

                    const formattedDate = formatPostDate(item.publishedDate, translatedText.language);
                    const html = `
			<div class="col-lg-4 col-md-6 padder-right-8 padder-left-8">
				<div class="latest-news mt-30" onclick="window.open('/${translatedText.language}/${item.seoId}/news/${item.slug}', '_blank')" style="cursor:pointer;">
					<div class="news-img-container">
						<img src="/Files/News/Headline/${item.imageURL}" onerror="this.onerror=null; this.src='/assets/images/default.jpg';" alt="" />
					</div>
					<span>${formattedDate}</span>
					<h3>${item.title}</h3>
					<p>${stripHtml(item.description)}</p>
					<a href="/${translatedText.language}/${item.seoId}/news/${item.slug}" class="learn-more-link" target="_blank">${translatedText.readmore}</a>
				</div>
			</div>
		`;

                    container.append(html);
                });
                //container.append('<div class="loadMoreWrapper"><a href="article.html" class= "load-more-btn" > View All News</a ></div>');
            }
            else {

            }

        },
        error: function (xhr, status, error) {

            console.error('Error fetching articles: ' + error);
        }
    });



    // Social sharing functionality


}

// Onclick class add and remove

$('#categories-icon').on('click', function () {
    $(".category-modal").addClass('open');
    $('.popup-close').removeClass('open');

});
$('.popup-close').on('click', function () {
    $(".category-modal").removeClass('open');

});