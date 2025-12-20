var currentPage = 0;

let user_name_list = new Array();
var full_data;
var data;

const DataPath = "data/sample_data.json";

function loadData() {
    var file = new XMLHttpRequest();
    file.open("GET", DataPath, true);
    file.onreadystatechange = () => {
        if (file.readyState === 4) {
            var raw_data = file.responseText;
            full_data = JSON.parse(raw_data);
            user_name_list = Object.keys(full_data);
        }
    }
    file.send();
}

function onLoad() {
    loadData();

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

function substituteText() {
    let swapText = (element_name) => {
        let x = document.getElementsByClassName(element_name);
        Array.from(x).forEach(el => el.innerText = data[element_name]);
    }
    Object.keys(data).forEach(key => swapText(key));
}

function onSubmitPressed() {
    let ta = document.getElementById("nameBox");
    let text = ta.value;
    console.log(text);
    if (text.length) {
        if (user_name_list.find(item => item === text)) {
            data = full_data[text];
            console.log("Found");

            substituteText();
            nextPage();
        }
    }
}
