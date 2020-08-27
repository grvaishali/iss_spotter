const request = require('request');
const { URL_IP_API, URL_GEO_API, URL_FLY_OVERTIMES } = require('./constants');

const fetchMyIP = function(callback) {

  request({ url: URL_IP_API }, (error, response, body) => {
    if (error !== undefined && error !== null) {
      callback(error, null);
      return;
    }

    if (response.statusCode && response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    callback(null, body);
    return;
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request({ url: URL_GEO_API + ip }, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body).data;

    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {

  let propertiesObject = { lat: coords.latitude, lon: coords.longitude };

  request({ url: URL_FLY_OVERTIMES, qs: propertiesObject }, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };
