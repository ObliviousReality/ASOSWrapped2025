var currentPage = 0;

function onLoad() {
    let pages = Array.from(document.getElementsByClassName("page"));

    pages.forEach(element => {
        element.classList.add("unopenedPage");
    });
    pages[currentPage].classList.remove("unopenedPage");
    pages[currentPage].classList.add("openPage");
}

function nextPage() {
    let pages = Array.from(document.getElementsByClassName("page"));

    if (currentPage + 1 === pages.length) {
        // end
        return;
    }

    pages[currentPage].classList.remove("openPage");
    pages[currentPage].classList.add("closedPage");

    currentPage++;
    if (currentPage == pages.length) {
        return;
    }
    pages[currentPage].classList.remove("closedPage");
    pages[currentPage].classList.add("openPage");
}
