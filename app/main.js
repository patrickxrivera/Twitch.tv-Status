const App = (function() {

  const publicApi = {
    init
  }

  return publicApi;

  // **************************

  async function init() {
    const streamerData = await Data.getStreamerData();
    console.log(streamerData);
  }

}());

const Data = (function() {

  function Endpoint(type, username) {
    this.url = `https://wind-bow.glitch.me/twitch-api/${type}/${username}`;
  }

  Endpoint.prototype.getUrl = function() {
    return this.url;
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
    const channelUrl = new Endpoint('channels', username).getUrl();
    const channelData = await getJsonFrom(channelUrl);
    return channelData;
  }

  async function getStatusDataFor(username) {
    const statusUrl = new Endpoint('streams', username).getUrl();
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

App.init();
