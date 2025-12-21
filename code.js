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
