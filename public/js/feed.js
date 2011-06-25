function renderFeed(event, data) {
  
  var li = '';
  console.log('event ', event);
  console.log('incoming data ', data);
  switch(event) {
    
    case 'o.log':
      li = renderLog(data);
    break;

    case 'o.request':
      li = renderRequest(data);
    break;

    default:
    break;
    
  }
  
  console.log(li);
  
  if ($('#status-feed li').length >= 12) {
    $('#status-feed li').last().remove();
  }
  
  var levelClass = (data.level || 'info');
  
  $('#status-feed').prepend('<li class = "' + levelClass + '">' + li + '</li>');
  
  $('#status-feed li').first().click(function(){
    $('#status-feed li').removeClass('active');
    $(this).addClass('active');
    console.log('got clicky');
  });
  
};


function renderRequest(request) {
  
  console.log('request ', request);
  var str = '';
  
  var date = new Date();
  
  var dateStr = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getHours() + ':' + date.getMinutes() + ':'+ date.getSeconds();

  str += '<span class = "url">';
  str += request.url;
  str += '</span>';

  str += '<span class = "timestamp">';
  str += dateStr;
  str += '</span>';

  return str;

}

function renderLog(logEvent) {
  console.log('log ', logEvent);

  var str = '';
  try {
    str += '<span class = "url">';
    str +=   logEvent.url;
    str += '</span>';
    str += '<span class = "msg">';
    str +=   logEvent.msg;
    str += '</span>';
    str += '<span class = "timestamp">';
    str +=   logEvent.timestamp;
    str += '</span>';
    /*
    str += '<span class = "meta">';
    str +=   JSON.stringify(logEvent.meta);
    str += '</span>';
    */
    
  }
  catch(err) {
    str += 'Invalid log event!';
  }

  return str;

}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 
              'May', 'Jun', 'Jul', 'Aug', 
              'Sep', 'Oct', 'Nov', 'Dec'];

