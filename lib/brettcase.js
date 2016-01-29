var Q = require('q')
  , request = require('request');

/**
 * Annoyingly, the titlecase "API" doesn't return proper status codes. As such,
 * we have to jump through hoops just to figure out whether the request failed.
 *
 * @param error
 * @param response
 * @returns {*|boolean}
 */
function requestFailed(error, response) {
  if (error || ! response) {
    return true;
  }

  if (response.statusCode < 200 || response.statusCode > 206) {
    return true;
  }

  var contentLength = response.headers.hasOwnProperty('content-length')
    ? parseInt(response.headers['content-length'])
    : 0;

  return (contentLength <= 0);
}

/**
 * Returns an object containing the standard request options.
 *
 * @returns {{url: string, qs: {title: *}, headers: {User-Agent: string}}}
 */
function getRequestOptions(input) {
  return {
    url: 'http://brettterpstra.com/titlecase/',
    qs: {title: input},
    headers: {'User-Agent': 'Brettcase'}
  };
}

/**
 * Builds an error object.
 *
 * @param error
 * @param response
 * @param data
 * @returns {{}}
 */
function buildError(error, response, data) {
  var err = {};

  // If the server is unreachable, response is null.
  if (response) {
    err.status = response.statusCode;
    err.message = data ? data.message : 'Unable to brettcase your string';
    err.code = data && data.code;
    err.moreInfo = data && data.moreInfo;
  } else {
    err.status = error.code;
    err.message = 'Unable to contact the brettcase API';
  }

  return err;
}

/**
 * The main module function.
 *
 * @param input
 * @returns {*|promise}
 */
function brettcase(input) {
  var deferred = Q.defer();
  var options = getRequestOptions(input);

  request(options, function (error, response, body) {
    var data = error ? error : body;

    var err = requestFailed(error, response)
      ? buildError(error, response, data)
      : null;

    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  });

  return deferred.promise;
}

module.exports = brettcase;