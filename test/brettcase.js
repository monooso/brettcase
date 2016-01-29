var nock = require('nock')
  , should = require('should')
  , brettcase = require('../lib/brettcase')
  , baseUrl = 'http://brettterpstra.com/titlecase';

function thenWhenCatchWasExpected(data) {
  throw Error('promise should return an error');
}

function mockSuccessfulCall(input, output) {
  return nock(baseUrl)
    .get('/')
    .query({title: input})
    .reply(200, output, {'Content-Length': output.length});
}

describe('#brettcase', function () {
  it('constructs the query string', function () {
    var input = 'input'
      , output = 'output'
      , mockApi = mockSuccessfulCall(input, output);

    return brettcase(input).then(function () {
      mockApi.done();
    });
  });

  it('returns the api response body', function () {
    var input = 'input'
      , output = 'output'
      , mockApi = mockSuccessfulCall(input, output);

    return brettcase(input).then(function (data) {
      data.should.be.exactly(output);
      mockApi.done();
    });
  });

  it('throws an error if the request fails', function () {
    var input = 'input'
      , output = 'Epic fail'
      , mockApi = nock(baseUrl).get('/').query({title: input}).replyWithError(output);

    var catchPromise = function(error) {
      mockApi.done();
    };

    return brettcase(input).then(thenWhenCatchWasExpected, catchPromise);
  });

  // The API returns a 200 code, even if there is a 5xx error.
  it('throws an error if the api does not return a string', function () {
    var input = 'input'
      , mockApi = mockSuccessfulCall(input, '');  // Empty response.

    var catchPromise = function(error) {
      mockApi.done();
    };

    return brettcase(input).then(thenWhenCatchWasExpected, catchPromise);
  });

  // Integration test, to confirm the API still behaves as expected.
  it('works with the real api', function () {
    var input = 'of mice and men'
      , output = 'Of Mice and Men';

    brettcase(input).then(function (data) {
      data.should.be.exactly(output);
    });
  });
});
