const request = require('request-promise-native');
const { URL_IP_API, URL_GEO_API, URL_FLY_OVERTIMES } = require('./constants');
const fetchMyIP = function() {
  return request(URL_IP_API);
};


const fetchCoordsByIP = function(body) {
  const ip = body;
  return request(URL_GEO_API + ip);
};

const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body).data;
  const url = `${URL_FLY_OVERTIMES}?lat=${latitude}&lon=${longitude}`;
  return request(url);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };