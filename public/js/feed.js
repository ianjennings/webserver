$(document).ready(function(){

  $('#status-feed li').live('click', function(){
    //$('#status-feed li').removeClass('active');
    if ($(this).hasClass('active')){
      $(this).removeClass('active');
    }
    else {
      $(this).addClass('active');
    }
  });

});

function renderFeed(event, data) {
  customPrepend('#status-feed', '<li>' + event + '</li>');
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
      // TODO: use .clone() instead
      $('li:eq(' + (i-1) + ')').before('<li class="' + $(e).attr('class') + '">' + $(e).html() + '</li>');
      $(e).remove();
    }
  });
  
}
