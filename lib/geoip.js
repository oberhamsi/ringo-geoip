/**
 * @fileoverview
 *
 * Lookup Location by IP
 *
 * Utilizes the Geo Database provided by http://maxmind.com
 * 
 * Query for City, Country, Region and Lat/Long as well as
 * distance between two IPs.
 * 
 * Example usage:
 *
 *     >> var loc = new Location('194.232.104.21')
 *     >> loc.country
 *     Austria
 *     >> loc.region
 *     Wien
 *     >> loc.city
 *     Vienna
 *     >> loc.latitude, loc.longitude
 *     16.36669921875
 *     >> [loc.latitude, loc.longitude]
 *     48.19999694824219,16.36669921875
 *     >> loc.timezone
 *     Europe/Vienna
 *     
 *     >> distance('194.232.104.21', '91.197.28.69')
 *     622.7711747120934 // in kilometer
 *
 *     >> var location = new Location('invalid.ip')
 *     Error: could not lookup ip invalid.ip
 */
importPackage(com.maxmind.geoip);
var fs = require('fs');
var geoip = com.maxmind.geoip;

/**
 * Get the distance in kilometers between to IPs.
 * @param {String} ipa ip address in dot format
 * @param {String} ipb ip address in dot format
 * @returns {Number} distance in kilometer
 */
exports.distance = function(ipa, ipb) {
   var loca = lookupService.getLocation(ipa);
   var locb = lookupService.getLocation(ipb);
   return loca.distance(locb);
};

/**
 * Holds geo location information the given IP, namely:
 *  - `country`
 *  - `region`
 *  - `city`
 *  - `latitude`
 *  - `longitude`
 *  - `timezone`
 *
 * @throws {Error} if IP is invalid
 * @param {String} ip IP address in dot format e.g. 213.52.50.8
 */
var Location = exports.Location = function(ip) {
   /**
    * @ignore
    */
   this._location = lookupService.getLocation(ip)
   if (this._location === null) throw new Error('could not lookup ip ' + ip);
   return this;
};

Object.defineProperties(Location.prototype, {

   /**
    * Country
    * @type String
    */
   country: {
      get: function() {
         return this._location.countryName;
      }
   },
   /**
    * Region
    * @type String
    */
   region: {
      get: function() {
         return geoip.regionName.regionNameByCode(this._location.countryCode, this._location.region);
      }
   },
   
   /**
    * City
    * @type String
    */
   city: {
      get: function() {
         return this._location.city;
      }
   },
   
   /**
    * Latitude
    * @type Number
    */
   latitude: {
      get: function() {
         return this._location.latitude;
      }
   },
   
   /**
    * Longitude
    * @type Number
    */
   longitude: {
      get: function() {
         return this._location.longitude;
      }
   },
   
   /**
    * Timezone (e.g. Europe/Berlin)
    * @type String
    */
   timezone: {
      get: function() {
         return geoip.timeZone.timeZoneByCountryAndRegion(this._location.countryCode, this._location.region);
      }
   },
});


var LookupService = function() {
   var dbFile = fs.join(module.directory, '../db/GeoLiteCity.dat');
   var service = geoip.LookupService(dbFile, com.maxmind.geoip.GEOIP_INDEX_CACHE);
   
   this.getLocation = function(ip) {
      // TODO to argument checks
      return service.getLocation(ip);
   }
   return;
};
var lookupService = lookupService || new LookupService();
