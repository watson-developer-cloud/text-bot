/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
require('dotenv').config({ silent: true });

var weather = require('../../lib/api/weather');

describe('weather.js', function() {
  this.timeout(5000);
  this.slow(3000);
  it('should return geo location for Miami', function(done) {
    weather.geoLocation({name: 'Miami'}, done);
  });

  it('should return error for non-US locations', function(done) {
    weather.geoLocation({name: 'Mar del Plata'}, function(err) {
      if (err && err === "Error http status: 404")
        done();
      else
        done(err);
    });
  });

  it('should return 10days forecast for Miami', function(done) {
    weather.forecastByGeoLocation({
      latitude: '25.7743',
      longitude: '-80.1937',
      range: '5day'
    }, done);
  });
});
