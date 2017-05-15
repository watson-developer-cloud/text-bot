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

var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  username: process.env.NATURAL_LANGUAGE_UNDERSTANDING_USERNAME,
  password: process.env.NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD,
  version_date: '2017-02-27'
});
var debug = require('debug')('bot:api:natural-language-understanding');

/**
 * Returns true if the entity.type is a city
 * @param  {Object}  entity NLU entity
 * @return {Boolean}        True if entity.type is a city
 */
function isCity(entity) {
   return entity.type === 'Location' && 'disambiguation' in entity && entity.disambiguation.subtype.indexOf("City") != -1;
}

/**
 * Returns only the name property
 * @param  {Object}  entity NLU entity
 * @return {Object}  Only the name property
 */
function onlyName(entity) {
  return { name: entity.text };
}

module.exports = {
  /**
   * Extract the city mentioned in the input text
   * @param  {Object}   params.text  The text
   * @param  {Function} callback The callback
   * @return {void}
   */
  extractCity: function(params, callback) {
    params.language = 'en';
    params.features={'entities':{}};
    natural_language_understanding.analyze(params, function(err, response) {
      debug('text: %s, entities: %s', params.text, JSON.stringify(response.entities));
      if (err) {
        callback(err);
      }
      else {
        var cities = response.entities.filter(isCity).map(onlyName);
        callback(null, cities.length > 0 ? cities[0]: null);
      }
    })
  }
};
