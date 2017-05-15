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

var naturalLanguage = require('../../lib/api/natural-language-understanding');

describe('natural-language-understanding.js', function () {
  this.timeout(3000);
  this.slow(1000);
  it('should return Miami if is detected', function (done) {
    var params = {
      text: 'I live in Miami'
    };
    naturalLanguage.extractCity(params, function (err, city) {
      if (city.name === 'Miami') {
        done();
      } else {
        done(JSON.stringify(city));
      }
    });
  });

  it('should return empty if no city is mentioned', function (done) {
    var params = {
      text: 'We don\'t have cities here'
    };
    naturalLanguage.extractCity(params, function (err, city) {
      if (!city) {
        done();
      } else {
        done(JSON.stringify(city));
      }
    });
  });
});
