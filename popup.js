var append = function(text){
  data.appendChild(document.createTextNode(text));
}

var download = function(format){
  document.getElementById('content').innerText = "preparing file...";

  chrome.history.search({
    'text': '', 
    // 'maxResults': 100, 
    'maxResults': 100000, 
    'startTime': 0
  }, function(res){
    window.res = res;

    var text, filename;

    // put the data in a hidden div so chrome doesn't crash
    if(format==="csv"){
      filename = "history.csv";



      // header row
      var keys = Object.keys(res[0]);
      append("formattedLastVisitTime," + keys.join(","));

      var row, time, value;
      var link;
      for(var i=0; i<res.length; i++){
        
        row = "";

        // convert time for excel
        time = new Date(res[i]["lastVisitTime"]);
        formatted = time.toISOString().replace('T', ' ').replace(/\.\d+Z/, '');
        row += formatted + ",";

        for(var j=0; j<keys.length; j++){
        
          if(j==4){
            link = JSON.stringify(res[i][keys[j]]);
            var rlink = getHostName(link);
            row += rlink;
          }else{
            row += JSON.stringify(res[i][keys[j]]);
          }
          
          
          if(j !== keys.length-1) row += ",";
        }
        append("\n" + row);
      }
    }else{
      filename = "history.json";

      append("[");
      for(var i=0; i<res.length; i++){
        text = JSON.stringify(res[i]);
        if(i !== res.length-1) text = text + ',';
        append(text);
      }
      append("]");
    }

    window.blob = new Blob([data.innerText], {type: 'application/octet-binary'});
    window.url = URL.createObjectURL(blob);

    var pom = document.createElement('a');
    pom.setAttribute('href', url);
    pom.setAttribute('download', filename);
    pom.click();

    window.close();
  });
}


document.addEventListener('DOMContentLoaded', function () {
  window.data = document.getElementById('data');

  // document.getElementById('json').onclick = function(){
  //   download('json');
  // };

  document.getElementById('csv').onclick = function(){
    download('csv');
  };

  
  document.getElementById('viz').onclick = function(){
    window.open("http://www.google.com");
  }
});


function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 &&
        typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}

