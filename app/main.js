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
  }

}());

const Data = (function() {
  let streamerData;

  function Endpoint(type, username) {
    this.url = `https://wind-bow.glitch.me/twitch-api/${type}/${username}`;
  }

  const publicApi = {
    getStreamerData,
    filterStreamers
  }

  return publicApi;

  // **************************

  async function getStreamerData() {
    streamerData = {
      "ESL_SC2": {
        logo: null,
        online: null,
        url: null
      },
      OgamingSC2: {
        logo: null,
        online: null,
        url: null
      },
      cretetion: {
        logo: null,
        online: null,
        url: null
      },
      freecodecamp: {
        logo: null,
        online: null,
        url: null
      },
      storbeck: {
        logo: null,
        online: null,
        url: null
      },
      habathcx: {
        logo: null,
        online: null,
        url: null
      },
      RobotCaleb: {
        logo: null,
        online: null,
        url: null
      },
      noobs2ninjas: {
        logo: null,
        online: null,
        url: null
      }
    }

    const endpoint = {
      channels: "https://wind-bow.glitch.me/twitch-api/channels/",
      streams: "https://wind-bow.glitch.me/twitch-api/streams/"
    }

    for (let username in streamerData) {
      const channelData = await getChannelDataFor(username);
      const statusData = await getStatusDataFor(username);
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

  function filterStreamers(keep) {
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
}());

const UI = (function() {

  const publicApi = {
    render,
    setAnimations
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
    Data.filterStreamers(this.innerText);
  }

}());

App.init();
