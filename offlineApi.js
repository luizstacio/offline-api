/*
 * Example of study
 * Modelu "Offline Api First", saving requests.
 */
var offlineApi = (function(window, document){
  var sendSuperClass = XMLHttpRequest.prototype.send,
      openSuperClass = XMLHttpRequest.prototype.open,
      offline = true;

  /* empty function */
  XMLHttpRequest.prototype.offlineSave = function (){};

  /* 
   * Override open function
   * save the request in localStorage
   */
  XMLHttpRequest.prototype.open = function (type, url) {
    var id = Date.now();

    mydb.insert('requests', {
      id: id, 
      url: url,
      type: type,
      data: undefined
    });

    this.requestId = id;

    openSuperClass.apply(this, arguments);
  }

  /* 
   * Override send function
   * execute and delete the requests in localStorage
   */
  XMLHttpRequest.prototype.send = function (data) {
    if ( navigator.onLine ) {
      mydb.remove('requests', { id: this.requestId });
      sendSuperClass.apply(this, arguments);
    } else {
      mydb.update('requests', { data: data }, { id: this.requestId });
      this.offlineSave(this.requestId);
    }
  }

  /*
   * Execute requests after the app return to online status
   */
  function sync () {
    //Send requests for server api.
    console.log('Send requests');
    console.log(mydb.find('requests', {}));

    /* clear collection */
    mydb.drop('requests');
  }

  /*
   * Add method sync on event online 
   */
  window.addEventListener("online", sync, false);

}(window, document));