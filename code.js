var currentPage = 0;

let user_name_list = new Array();
let real_name_list = new Array();
var full_data;
var data;

const DataPath = "data/data.json";

var friendsPage = 12

function loadData() {
    var file = new XMLHttpRequest();
    file.open("GET", DataPath, true);
    file.onreadystatechange = () => {
        if (file.readyState === 4) {
            var raw_data = file.responseText;
            full_data = JSON.parse(raw_data);
            user_name_list = Object.keys(full_data);
            Object.keys(full_data).map(item => real_name_list.push(full_data[item]["real_name"]));
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
    pages[currentPage].classList.remove("unopenedPage");
    pages[currentPage].classList.add("openPage");
}

function goToPage(pageNumber) {
    let pages = Array.from(document.getElementsByClassName("page"));
    for (let i = 0; i < pages.length; ++i) {
        if (i < pageNumber) {
            pages[i].classList.remove("unopenedPage");
            pages[i].classList.remove("openPage");
            pages[i].classList.add("closedPage");
        }
        else if (i > pageNumber) {
            pages[i].classList.remove("closedPage");
            pages[i].classList.remove("openPage");
            pages[i].classList.add("unopenedPage");
        }
        else {
            pages[i].classList.remove("closedPage");
            pages[i].classList.remove("unopenedPage");
            pages[i].classList.add("openPage");
        }
    }
    currentPage = pageNumber;
}

function getFriendsPage() {
    return friendsPage;
}

function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function fillYearChart(messages) {
    let chart = document.getElementById("yearChart");
    let bars = chart.children;
    let totalMessages = messages.reduce((s, el) => s + el, 0);
    let percents = messages.map(elem => ((elem / totalMessages) * 100));
    let min = Math.min(...percents);
    let max = Math.max(...percents);

    for (let i = 0; i < chart.childElementCount; i++) {
        let bar = bars[i];
        m = messages[i];
        let percent = scale(percents[i], min, max, 0, 100) + '%';
        bar.style.width = percent;
        bar.innerText = m;
    }
}

function substituteText() {
    let swapText = (element_name, value) => {
        let x = document.getElementsByClassName(element_name);
        Array.from(x).forEach(el => el.innerText = value);
    }
    let swapTextKey = (element_name) => {
        let suffix = "";
        if (element_name.includes("rank")) {
            let d = data[element_name];
            if (d === 1 || d == 21) {
                suffix = "st";
            }
            else if (d == 2 || d == 22) {
                suffix = "nd";
            }
            else if (d === 3 || d === 23) {
                suffix = "rd";
            }
            else {
                suffix = "th";
            }
        }
        if (element_name.includes("percent")) {
            suffix = "%";
        }
        swapText(element_name, data[element_name] + suffix);
    }
    Object.keys(data).forEach(key => swapTextKey(key));
    let messagesEachYear = data["messages_each_year"];
    swapText("2025Messages", messagesEachYear[8]);
    let mmcp = Math.round((data["most_messaged_channel_count"] / messagesEachYear[8]) * 100 * 100) / 100 + "%";
    swapText("most_messaged_channel_percent", mmcp);

    fillYearChart(messagesEachYear);
    let t = data["pings_match"];
    if (data["pings_match"]) {
        friendsPage = 11;
        document.getElementById("notFriends").style.display = "none";
    }
    else {
        friendsPage = 12;
        document.getElementById("bestFriends").style.display = "none";
    }
}

function onSubmitPressed() {
    let ta = document.getElementById("nameBox");
    let text = ta.value;
    if (text.length) {
        let temp_text = text[0].toUpperCase() + text.slice(1).toLowerCase();
        if (real_name_list.find(item => item === temp_text)) {
            text = user_name_list[real_name_list.indexOf(temp_text)];
        }

        if (user_name_list.find(item => item === text)) {
            data = full_data[text];
            console.log("Found");

            substituteText();
            nextPage();
        }
    }
}
