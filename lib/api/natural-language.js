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
  'username': process.env.NLU_USERNAME,
  'password': process.env.NLU_PASSWORD,
  'version_date': '2017-02-27'
});
var debug = require('debug')('bot:api:natural-language');

/**
 * Returns true if the entity.type is a city
 * @param  {Object}  entity Alchemy entity
 * @return {Boolean}        True if entity.type is a city
 */
function isCity(entity) {
   //return entity.type === 'City';
   return true;
}

/**
 * Returns only the name property
 * @param  {Object}  entity Alchemy entity
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
  extractCity: function(paramsIn, callback) {

    var paramsOut  = "{\"text\": \"" + paramsIn.text.toString()
      + "\",\"features\": {\"entities\": {\"limit\": 5}}}";

    natural_language_understanding.analyze(JSON.parse(paramsOut), function(err, response) {
      //debug('text: %s, entities: %s', paramsIn.text, JSON.stringify(response));
      if (err) {
        callback(err);
      } else {
        console.log("XXXX " + JSON.stringify(response, null, 2));

        var cities = [];

        if(response.entities.toString().length > 0 && response.entities[0].type.toLowerCase() === "location") {

          var isCity = true;

          if(response.entities[0].hasOwnProperty('disambiguation')) {
            if(response.entities[0].disambiguation.hasOwnProperty('subtype')) {
              if(response.entities[0].disambiguation.subtype.StateOrCounty !== null) {
                isCity = false;
              }
            }
          }

          if(isCity) {
            cities[0] = JSON.parse("{\"name\":\"" + response.entities[0].text + "\"}");
          }
        }
        callback(null, cities.length > 0 ? cities[0]: null);
      }
    })
  }
};
