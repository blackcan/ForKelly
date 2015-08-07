// testest

var template_web_result = {};

var data_web_result = {};

function WebResultObj(title, url, content){
	this.html = template_web_result;
	this.html = this.html.replace('$TITLE$', title).replace('$URL$', url).replace('$CONTENT$', content);
}

function replace_web_result(){
	var search_results_dom = $('div#ires div.srg');
	search_results_dom.html('');
	for(i in data_web_result){
		var result_obj = new WebResultObj(
			data_web_result[i].title, 
			data_web_result[i].url,
			data_web_result[i].content);
		search_results_dom.append(result_obj.html);
	}
}

function listen_web_result(event){
	if(event.srcElement.id == 'fbar'){
		replace_web_result();
	}
}

function web_search_inject(){
	console.log(data_web_result);
	if($('div#ires div.srg')[0]){
		replace_web_result();
	}
	else{
		$('div#main')[0].addEventListener('DOMNodeInserted', listen_web_result);
	}
}

function main(){
	$.ajaxSetup({async:false});
	var url = $(location).attr('href');
	if(url.indexOf('q=') > -1){
		if($(location).attr('hash').indexOf('q=') > -1 || url.indexOf('tbm') === -1){
			console.log('web search');
			$.get(chrome.extension.getURL('./templates/web_results.html'), function(data){
				template_web_result = data;
			})
			$.get(chrome.extension.getURL('./data/web_results.json'), function(data){
				data_web_result = JSON.parse(data);
			})
			web_search_inject();
		}
		else if(url.indexOf('tbm=isch') > -1){
			console.log('image search');
		}
		else if(url.indexOf('tbm=vid') > -1){
			console.log('video search');
		}
	}
}

$("document").ready(function(){
	main();
})
$(window).bind('hashchange', function(){
	main();
})
