(function(window, document){
  var request = new XMLHttpRequest(),
      $log = document.getElementById('log'),
      $requestLog = document.getElementById('requestLog'),
      $status = document.getElementById('status'),
      $btn = document.getElementById('btn');

  /* Open and send request */
  function sendRequest () {
    request.open('GET', 'http://localhost:8080/', true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        resp = request.responseText;
      }
    };
    /* Callback in offline state */
    request.offlineSave = function () {
      $log.innerHTML = ('You is offline. Your changes will be synchronized when you are online.');
    };
    request.send( 'timestamp=' + Date.now() );
    list();
  }

  /* List the requests data */
  function list () {
    var rows = '',
        data = mydb.find('requests', {}) || [];


    data.forEach(function(item){
      rows += '<tr>';
      rows +=   '<td>'+ item.id +'</td>';
      rows +=   '<td>'+ item.type +'</td>';
      rows +=   '<td>'+ item.url +'</td>';
      rows +=   '<td>'+ item.data +'</td>';
      rows += '</tr>';
    });

    $requestLog.innerHTML = rows;
  }

  $btn.addEventListener('click', sendRequest);
  list();

  /* Check state of connection */
  function load () {
    $status.innerHTML = navigator.onLine ? 'Online' : 'Offline';
    if ( navigator.onLine ) $log.innerHTML = '';
    list();
  }
  load();
  window.addEventListener('online', load);
  window.addEventListener('offline', load);

}(window, document));