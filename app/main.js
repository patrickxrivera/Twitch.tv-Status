const App = (function() {

  const publicApi = {
    init
  }

  return publicApi;

  // **************************

  async function init() {
    const streamerData = await Data.getStreamerData();
    UI.renderAll(streamerData);
    UI.setAnimations();
  }

}());

const Data = (function() {

  function Endpoint(type, username) {
    this.url = `https://wind-bow.glitch.me/twitch-api/${type}/${username}`;
  }

  const publicApi = {
    getStreamerData
  }

  return publicApi;

  // **************************

  async function getStreamerData() {
    var streamerData = {
      "ESL_SC2": {
        logo: null,
        online: null
      },
      OgamingSC2: {
        logo: null,
        online: null
      },
      cretetion: {
        logo: null,
        online: null
      },
      freecodecamp: {
        logo: null,
        online: null
      },
      storbeck: {
        logo: null,
        online: null
      },
      habathcx: {
        logo: null,
        online: null
      },
      RobotCaleb: {
        logo: null,
        online: null
      },
      noobs2ninjas: {
        logo: null,
        online: null
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

}());

const UI = (function() {

  const publicApi = {
    renderAll,
    setAnimations
  }

  return publicApi;

  function renderAll(streamerData) {
    for (let streamer in streamerData) {
      const data = {};
      [data.username, data.logo, data.online] = [streamer, streamerData[streamer].logo, streamerData[streamer].online];
      render(data);
    }
  }

  function render(data) {
    const results = document.getElementsByClassName('results')[0];
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
      `<div class="results__container">
        <img class="results__logo" src="${data.logo}" alt="">
        <span class="results__username">${data.username}</span>
        <div class="results__status-container">
          <div class="${status}"></div>
        </div>
       </div>`
    return resultsHTML;
  }

  function getStatusFrom(data) {
    return data.online ? 'results__status--online' : 'results__status--offline';
  }

  function setAnimations() {
    // highlight nav__all on start
    // add click event listener for nav elements

    // add click event
      // loop through nav els and add click listener
        // onclick,
        // remove class from all
        // add class to clicked el

    const navEls = document.querySelectorAll('.nav div');
    navEls.forEach(el => el.addEventListener('click', () => addNavAnimations.call(el, navEls)));
  }

  function addNavAnimations(navEls) {
    navEls.forEach(el => el.removeAttribute('id'));
    this.setAttribute('id', 'nav__clicked');
  }

}());

App.init();
