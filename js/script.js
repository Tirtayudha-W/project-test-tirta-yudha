document.addEventListener('DOMContentLoaded', () => {
    // Parallax Effect
    document.addEventListener('scroll', function() {
        const parallax = document.querySelector('.hero-content');
        let scrollPosition = window.pageYOffset;
        parallax.style.transform = 'translateY(' + (scrollPosition * 0.5) + 'px)';
    });

    // Header Transparency
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    document.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scroll ke bawah
            header.classList.add('transparent');
            header.classList.remove('at-top');
        } else {
            // Scroll ke atas
            if (scrollTop === 0) {
                header.classList.add('at-top');
                header.classList.remove('transparent');
            } else {
                header.classList.remove('at-top');
                header.classList.remove('transparent');
            }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Untuk scroll ke atas dari bawah halaman
    });

    // Sort and Pagination
    const articles = Array.from(document.querySelectorAll('.article'));
    const perPageSelect = document.getElementById('show-per-page');
    const sortSelect = document.getElementById('sort-by');
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const prevBtn = document.querySelector('.pagination-prev');
    const nextBtn = document.querySelector('.pagination-next');

    let currentPage = 1;
    let perPage = parseInt(perPageSelect.value);
    let sortOption = sortSelect.value;

    function paginateArticles() {
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;
        articles.forEach((article, index) => {
            if (index >= start && index < end) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    }

    function updatePagination() {
        paginationNumbers.forEach((number, index) => {
            number.classList.toggle('active', index + 1 === currentPage);
        });
    }

    function handleSort() {
        if (sortOption === 'newest') {
            articles.sort((a, b) => {
                const dateA = new Date(a.querySelector('.article-content p').textContent);
                const dateB = new Date(b.querySelector('.article-content p').textContent);
                return dateB - dateA; // Newest first
            });
        } else if (sortOption === 'oldest') {
            articles.sort((a, b) => {
                const dateA = new Date(a.querySelector('.article-content p').textContent);
                const dateB = new Date(b.querySelector('.article-content p').textContent);
                return dateA - dateB; // Oldest first
            });
        }

        // Re-render articles
        const articlesContainer = document.querySelector('.articles');
        articles.forEach(article => articlesContainer.appendChild(article));
    }

    perPageSelect.addEventListener('change', () => {
        perPage = parseInt(perPageSelect.value);
        paginateArticles();
    });

    sortSelect.addEventListener('change', () => {
        sortOption = sortSelect.value;
        handleSort();
        paginateArticles();
    });

    paginationNumbers.forEach(number => {
        number.addEventListener('click', () => {
            currentPage = parseInt(number.textContent);
            paginateArticles();
            updatePagination();
        });
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            paginateArticles();
            updatePagination();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < paginationNumbers.length) {
            currentPage++;
            paginateArticles();
            updatePagination();
        }
    });

    // Initial load
    handleSort();
    paginateArticles();
    updatePagination();

    // Fetch data with parameters
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://suitmedia-backend.suitdev.com/api/ideas'; // Ganti dengan URL API yang ingin Anda akses

    const params = new URLSearchParams({
        'page[number]': currentPage,
        'page[size]': perPage,
        'append': ['small_image', 'medium_image'].join(','),
        'sort': sortOption
    }).toString();

    fetch(proxyUrl + targetUrl + '?' + params)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error fetching data:', error));
});
