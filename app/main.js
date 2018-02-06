const App = (function() {

  const publicApi = {
    init
  }

  return publicApi;

  // **************************

  async function init() {
    const streamerData = await Data.getStreamerData();
    UI.render(streamerData);
    UI.setAnimations();
    UI.bindActions();
  }

}());

const Data = (function() {
  let streamerData;

  function Endpoint(type, username) {
    this.url = `https://wind-bow.glitch.me/twitch-api/${type}/${username}`;
  }

  const publicApi = {
    getStreamerData,
    filterNav,
    filterSearch
  }

  return publicApi;

  // **************************

  async function getStreamerData() {
    streamerData = {
      "ESL_SC2": {
        logo: null,
        online: null,
        url: null,
        category: 'Combat'
      },
      OgamingSC2: {
        logo: null,
        online: null,
        url: null,
        category: 'Combat'
      },
      cretetion: {
        logo: null,
        online: null,
        url: null,
        category: 'Combat'
      },
      freecodecamp: {
        logo: null,
        online: null,
        url: null,
        category: 'Programming'
      },
      storbeck: {
        logo: null,
        online: null,
        url: null,
        category: 'Sports'
      },
      RobotCaleb: {
        logo: null,
        online: null,
        url: null,
        category: 'Programming'
      },
      noobs2ninjas: {
        logo: null,
        online: null,
        url: null,
        category: 'Programming'
      },
      omgitsfirefoxx: {
        logo: null,
        online: null,
        url: null,
        category: 'Entertainment'
      },
      omgitsfirefoxx: {
        logo: null,
        online: null,
        url: null,
        category: 'Entertainment'
      },
      kindafunnygames: {
        logo: null,
        online: null,
        url: null,
        category: 'Entertainment'
      }
    }

    const endpoint = {
      channels: "https://wind-bow.glitch.me/twitch-api/channels/",
      streams: "https://wind-bow.glitch.me/twitch-api/streams/"
    }

    for (let username in streamerData) {
      const channelData = await getChannelDataFor(username);
      const statusData = await getStatusDataFor(username);
      // console.log(channelData);
      streamerData[username].logo = channelData.logo;
      streamerData[username].online = statusData.stream ? true : false;
      streamerData[username].url = channelData.url;
    }
    return streamerData;
  }

  async function getChannelDataFor(username) {
    const channelUrl = new Endpoint('channels', username).url;
    const channelData = await getJsonFrom(channelUrl);
    return channelData;
  }

  async function getStatusDataFor(username) {
    const statusUrl = new Endpoint('streams', username).url;
    const statusData = await getJsonFrom(statusUrl);
    return statusData;
  }

  async function getJsonFrom(url) {
    try {
      let response = await fetch(url);
      let data = await response.json();
      return data;
    }
    catch(err) {
      console.warn('Error', err);
    }
  }

  function filterNav(keep) {
    let results = {};

    for (let streamer in streamerData) {
      const value = streamerData[streamer];

      if (selectedAll(keep)) { results[streamer] = value; }
      else if (selectedOnline(keep, value)) { results[streamer] = value; }
      else if (selectedOffline(keep, value)) { results[streamer] = value; }
    }

    UI.render(results);
  }

  function selectedAll(keep) {
    return keep === 'All';
  }

  function selectedOnline(keep, value) {
    return keep === 'Online' && value.online;
  }

  function selectedOffline(keep, value) {
    return keep === 'Offline' && !value.online;
  }

  function filterSearch(searchVal) {
    let results = {};

    for (let streamer in streamerData) {
      if (isSearchVal(streamer, searchVal)) {
        results[streamer] = streamerData[streamer];
      }
    }

    UI.render(results);
  }

  function isSearchVal(streamer, searchVal) {
    [streamer, searchVal] = [streamer.toLowerCase(), searchVal.toLowerCase()];
    return streamer.startsWith(searchVal);
  }

}());

const UI = (function() {
  const dropdown = document.querySelector('.dropdown');
  const header = document.querySelector('.header');
  const mainContainer = document.querySelector('.container__main');
  const innerContainer = document.querySelector('.container__inner');
  let open = false; // TODO

  const publicApi = {
    render,
    setAnimations,
    bindActions
  }

  return publicApi;

  function render(streamerData) { // TODO better name
    const results = document.getElementsByClassName('results')[0];
    results.innerHTML = '';
    for (let streamer in streamerData) {
      const data = {};
      [data.username, data.logo, data.online, data.url] =
        [
          streamer,
          streamerData[streamer].logo,
          streamerData[streamer].online,
          streamerData[streamer].url
        ];
      renderHTMLFor(data, results);
    }
  }

  function renderHTMLFor(data, results) {
    const resultEntry = createResultEntryEl(data);
    results.appendChild(resultEntry);
  }

  function createResultEntryEl(data) {
    const resultEntry = document.createElement('div');
    resultEntry.classList.add('results__entry');
    resultEntry.innerHTML = constructHTMLFor(data);
    return resultEntry;
  }

  function constructHTMLFor(data) {
    const status = getStatusFrom(data);
    let resultsHTML =
      `<a href="${data.url}" target="_blank">
        <div class="results__container">
          <img class="results__logo" src="${data.logo}" alt="">
          <span class="results__username">${data.username}</span>
          <div class="results__status-container">
            <div class="${status}"></div>
          </div>
        </div>
       </a>`
    return resultsHTML;
  }

  function getStatusFrom(data) {
    return data.online ? 'results__status--online' : 'results__status--offline';
  }

  function setAnimations() {
    setNavAnimations();
  }

  function setNavAnimations() {
    const navEls = document.querySelectorAll('.nav div');
    navEls.forEach(el => el.addEventListener('click', () => addNavAnimations.call(el, navEls)));
  }

  function addNavAnimations(navEls) {
    navEls.forEach(el => el.removeAttribute('id'));
    this.setAttribute('id', 'nav__clicked');
    Data.filterNav(this.innerText);
  }

  function bindActions() {
    handleSearch();
    handleFilter();
  }

  function handleSearch() {
    const input = document.querySelector('.search__input input');
    input.addEventListener('keyup', getSearch);
  }

  function getSearch() {
    const searchVal = this.value;
    Data.filterSearch(searchVal);
  }

  function handleFilter() {
    const filterIcon = document.querySelector('.header__filter svg');
    filterIcon.addEventListener('click', checkFilterState);
  }

  function checkFilterState() {
    open = !open;

    open ? renderFilterEl() : removeFilterEl();
  }

  function renderFilterEl() {
    addClass(dropdown, 'open');
    addClass(mainContainer, 'modal');
    addClass(innerContainer, 'darken');
    addClass(header, 'darken');
  }

  function removeFilterEl() {
    removeClass(dropdown, 'open');
    removeClass(mainContainer, 'modal');
    removeClass(innerContainer, 'darken');
    removeClass(header, 'darken');
  }

  function removeClass(el, className) {
    el.classList.remove(className);
  }

  function addClass(el, className) {
    el.classList.add(className);
  }

}());

App.init();
