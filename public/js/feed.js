$(document).ready(function(){

  $('#status-feed li').live('click', function(){
    //$('#status-feed li').removeClass('active');
    $(this).addClass('active');
  });

});

function renderFeed(event, data) {
  
  var li = '';

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

  var levelClass = (data.level || 'info');

  customPrepend('#status-feed', '<li class = "' + levelClass + '">' + li + '</li>');

};


//
//  customPrepend is used instead of $.append(),
//  so we can keep .active elements 'fixed' in position,
//  while other elements "scroll past"
//
function customPrepend(ul, li) {
  
  if (!$('li', ul).length) {
    $(ul).prepend(li);
    return;
  }
  
  if ($('li', ul).length >= 25) {
    $('#status-feed li').last().remove();
  }

  $(ul).prepend(li);

  var last;
  // Iterate through every li element, pushing it down, unless its active
  $('li', ul).each(function(i,e){
    if($(e).hasClass('active')){
      $('li:eq(' + (i-1) + ')').before('<li class="active">' + $(e).html() + '</li>');
      $(e).remove();
    }
  });
  
}

function renderRequest(request) {
  
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

