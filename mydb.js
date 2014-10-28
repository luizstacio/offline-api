/*
 * Abstraction for the api localStorage, create the methods: insert, find, update, remove.
 */
var mydb =(function(window, document){

  var localStorage = window.localStorage;
  
  /*
   * Create and insert data in localStorage
   * @param {String} Collection name of collection
   * @param {Object/Object[]} Data data of collection
   */
  function insert (collection, data) {
    var stringfyData,
        preData,
        retriveCollection = find(collection, {});

    if ( Object.prototype.toString.call(data) === "[object Array]" ) {
      preData = data;
    } else {
      preData = [data];
    }

    stringfyData = JSON.stringify(retriveCollection ? retriveCollection.concat(preData) : preData);
    return localStorage.setItem(collection, stringfyData);
  }

  /*
   * Find in collection, filtering by query.
   * @param {String} Collection name of collection
   * @param {Object} Query filter data the collection
   */
  function find (collection, query) {
    var data = JSON.parse(localStorage.getItem(collection)),
        keys = Object.keys(query || {}),
        keysLength = keys.length;

    // filter by query
    if ( keysLength !== 0 ) {
      data = data.filter(function(item){
        var results = 0, i = 0;

        for (; i < keysLength; ++i) {
          if ( item[keys[i]] === query[keys[i]] ) ++results;
        }

        return ( results === keysLength );
      });
    }

    return data;
  }

  /*
   * Remove the first item found in collection, filtering by query.
   * @param {String} Collection name of collection
   * @param {Object} Query filter data the collection
   */
  function remove (collection, query) {
    var data = JSON.parse(localStorage.getItem(collection)),
        keys = Object.keys(query || {}),
        keysLength = keys.length;

    // filter by query
    data.forEach(function(item, index){
      var results = 0, i = 0;

      for (; i < keysLength; ++i) {
        if ( item[keys[i]] === query[keys[i]] ) ++results;
      }

      if ( results === keysLength ) {
        data.splice(index, 1);
      }
    });

    return localStorage.setItem(collection, JSON.stringify(data));
  }

  /*
   * Update the first item found in collection, filtering by query.
   * @param {String} Collection name of collection
   * @param {Object} Data data for update in item
   * @param {Object} Query filter data the collection
   */
  function update (collection, obj, query) {
    var data = JSON.parse(localStorage.getItem(collection)),
        keys = Object.keys(query || {}),
        keysLength = keys.length;

    // filter by query
    data.forEach(function(item, index){
      var results = 0, i = 0;

      for (; i < keysLength; ++i) {
        if ( item[keys[i]] === query[keys[i]] ) ++results;
      }

      if ( results === keysLength ) {
        for ( key in obj ) {
          item[key] = obj[key];
        }
      }
    });

    return localStorage.setItem(collection, JSON.stringify(data));
  }
 
  /*
   * Drop collection.
   * @param {String} name of collection
   */
  function drop (collection) {
    localStorage.setItem(collection, '[]');
  }

  return {
    insert: insert,
    find: find,
    remove: remove,
    update: update,
    drop: drop
  }

}(window, document))