/*
use for crawling google pages
@author becxer
@email becxer87@gmail.com
*/

var fs = require('fs');
var util = require('util');
var https = require('https');

var callback_for_result = undefined;
callback_search = function(response) {
  var html = '';
  
  response.on('data', function (chunk) {
    html += chunk;
  });

  response.on('end', function () {
    rclist = html.split('class="rc"');
    url_list = [];
    for (i in rclist){
        if ( i > 0 ) {
            url = rclist[i].split('<a href="')[1].split('"')[0];
            url_list.push(url);
        }
    }
    callback_for_result(url_list);
  });
}

search = function(query, page_num, callback_for_res){
    callback_for_result = callback_for_res;
    var encoded_query = encodeURI(query);
    var query_url = util.format('/search?q=%s&rlz=1C1OPRB_enKR535KR535&oq=%s'+
                            '&aqs=chrome.0.69i59j0l5.1309j0j9'+
                            '&sourceid=chrome&es_sm=122&ie=UTF-8'+
                            '&start=%d', 
                            encoded_query, encoded_query, page_num * 10);
    var options = {
      host: 'www.google.com',
      path: query_url,
      headers: {'referer': 'https://www.google.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 6.1) '+
            'AppleWebKit/537.36 (KHTML, like Gecko) '+
            'Chrome/44.0.2403.157 Safari/537.36'}};
    https.request(options, callback_search).end();
};

exports.search = search;
