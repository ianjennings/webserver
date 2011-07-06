var hookio_pingers = {};
var hookio_chart_colors = [
'214, 28, 89',
'231, 216, 75',
'27, 135, 152'
];

var chart = new SmoothieChart({
  
  grid: { fillStyle:'#000000', strokeStyle: '#777777', lineWidth: 1, millisPerLine: 2000, verticalSections: 2 },
  millisPerPixel: 50,
  fps: 20,
  minValue: 0
  
});


/*
options.grid = options.grid || { fillStyle:'#000000', strokeStyle: '#777777', lineWidth: 1, millisPerLine: 1000, verticalSections: 2 };
options.millisPerPixel = options.millisPerPixel || 20;
options.fps = options.fps || 20;
options.maxValueScale = options.maxValueScale || 1;
options.minValue = options.minValue;
options.labels = options.labels || { fillStyle:'#ffffff' }
*/

$(document).ready(function(){



});

function renderPinger(source, data) {
  
  var li = '';

  switch(source) {

    case 'o.gotPong':
      inspectResponse(data);
    break;

    default:
    break;

  }

  //customPrepend('#status-feed', '<li class = "' + levelClass + '">' + li + '</li>');

};

function inspectResponse(data){
  
  
  var statusClass = 'info', statusMsg = "ONLINE";
  
  if(data.err){
    statusClass = 'error';
    statusMsg   = "ERROR";
  }
  
  
  
    // 
    // If we are creating a new pinger box
    //
    if ($('#' + slug(data.name), '#pinger').length === 0) {
      
      hookio_pingers[slug(data.name)] = {};
      hookio_pingers[slug(data.name)].TS = new TimeSeries();
      
      var chartColor = hookio_chart_colors.pop() || '209, 251, 215';
      
      chart.addTimeSeries(hookio_pingers[slug(data.name)].TS, {
        strokeStyle: 'rgba(' + chartColor + ', 1)', 
        fillStyle: 'rgba(' + chartColor + ', 0.2)', 
        lineWidth: 10 
      });
        
      chart.streamTo(document.getElementById("chart"), 50);

      var li = '<li class= "site" id = "' + slug(data.name) + '">';
      li += renderPing(data);
      li += '</li>';
      $('#pinger').append(li);
      
      
      $('#' + slug(data.name), '#pinger').data('chartColor', chartColor);
      $('#' + slug(data.name), '#pinger').data('statusClass', statusClass);
      
      $('.status', '#' + slug(data.name)).addClass(statusClass);
      $('.status', '#' + slug(data.name)).text(statusMsg);
      $('.swatch', '#' + slug(data.name)).css('background-color', 'rgb(' + chartColor + ')');
      
      $('#' + slug(data.name)).fadeIn();
    } else {

      $('#' + slug(data.name)).fadeOut(function(){
        $('#' + slug(data.name)).html(renderPing(data));
        
        $('.status', '#' + slug(data.name)).addClass(statusClass);
        $('.status', '#' + slug(data.name)).text(statusMsg);
        
        $('.swatch', '#' + slug(data.name)).css('background-color', 'rgb(' + $('#' + slug(data.name), '#pinger').data('chartColor') + ')');
        
        
        $('#' + slug(data.name)).fadeIn();
      });

    }


    
    hookio_pingers[slug(data.name)].TS.append(new Date().getTime(), Number(data.requestTime));
    


};

function slug(str) {
  var str = str || '';
  return str.replace(/ /g, '_');
}

function renderPing(data) {
  
  var str = '';
  
  var date = new Date();
  
  var dateStr = date.getHours() + ':' + date.getMinutes() + ':'+ date.getSeconds();
  str += '<div class="swatch"></div>';
  str += '<h1>';
  str += data.name;
  str += '</h1>'
  str += '<a href = "'+data.url+'">' + data.url +'</a>';

  str += '<ul class="details">';
//  str += '<li> Pings: ' + data.attempts + '</li>';
//  str += '<li> Pongs: ' + data.pongs + '</li>';
//  str += '<li>Uptime: ' + '10 hours' + '</li>';

  str += '<li class="ping"><span class="ping">' + data.requestTime + 'ms</span></li>';
  str += '<li class="datetime">Last activity: <span class="datetime">' + dateStr + '</span></li>';


  /*
  
  if(data.err){
    str += '<li>' + data.err.message + '</li>';
  }

  if(data.statusCode){
    str += '<li>Response Code: ' + data.statusCode + '</li>';
  }
  */

  str += '</ul>';

  str += '<div class="status"></div>';

  return str;

}
