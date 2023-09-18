const inputSearch = document.querySelector('input');
const inputContainer = document.querySelector('.dropdown');
const results = document.querySelector('.results');

results.addEventListener('click', function (e) {
    let target = e.target;
    if (!target.classList.contains('btn-close')) return;

    target.parentElement.remove();
});

inputContainer.addEventListener('click', function (e) {
    let target = e.target;
    if (!target.classList.contains('dropdown-content')) {
        return;
    }
    addResult(target);
    inputSearch.value = '';
    removePredictions();
});

function removePredictions() {
    inputContainer.innerHTML = '';
}

function showPredictions(rep) {
    removePredictions();
    for (let repIndex = 0; repIndex < 5; repIndex++) {
        let name = rep.items[repIndex].name;
        let owner = rep.items[repIndex].owner.login;
        let stars = rep.items[repIndex].stargazers_count;

        let dropdownContent = `<div class='dropdown-content' data-owner="'${owner}"' data-stars='${stars}'>${name}</div>`;
        inputContainer.innerHTML += dropdownContent;
    }
}

function addResult(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;

    results.innerHTML += `<div class='result'>Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class='btn-close'></button></div>`;
}

async function getPredictions() {
    const BaseUrl = new URL('https://api.github.com/search/repositories');
    let repValue = inputSearch.value;
    if (repValue === '') {
        removePredictions();
        return;
    }

    BaseUrl.searchParams.append('q', repValue)
    try {
        let response = await fetch(BaseUrl);
        if (response.ok) {
            let rep = await response.json();
            showPredictions(rep);
        } else return null;
    } catch (error) {
        return null;
    }
}

function debounce(fn, timeout) {
    let timer = null;

    return (...args) => {
        clearTimeout(timer);
        return new Promise((resolve) => {
            timer = setTimeout(
                () => resolve(fn(...args)),
                timeout,
            );
        });
    };
}

const getPredictionsDebounce = debounce(getPredictions, 500);
inputSearch.addEventListener("input", getPredictionsDebounce);