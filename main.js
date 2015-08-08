var template_web_result = {};

var data_web_result = {};

function WebSearchInjector(){
	var web_result_template = ''
	var web_result_data = ''
	$.get(chrome.extension.getURL('./templates/web_results.html'), function(data){
		web_result_template = data;
	})
	$.get(chrome.extension.getURL('./data/web_results.json'), function(data){
		web_result_data = JSON.parse(data);
	})

	var _create_web_result_dom = function(title, url, content){
		var template = web_result_template;
		template = template.replace('$TITLE$', title).replace('$URL$', url).replace('$CONTENT$', content);
		return template
	}

	var _replace_web_result = function (){
		var search_results_dom = $('div#ires div.srg');
		search_results_dom.html('');
		var web_result_down = web_result_data.web_result_down;
		for(i in web_result_down){
			var result_dom = _create_web_result_dom(
				web_result_down[i].title, 
				web_result_down[i].url,
				web_result_down[i].content);
			search_results_dom.append(result_dom);
		}
	}

	var _listen_web_result = function (event){
		if(event.srcElement.id == 'fbar'){
			_replace_web_result();
		}
	}
	this.inject = function (){
		if($('div#ires div.srg')[0]){
			_replace_web_result();
		}
		else{
			$('div#main')[0].addEventListener('DOMNodeInserted', _listen_web_result);
		}
	}
}

function main(){
	$.ajaxSetup({async:false});
	var url = $(location).attr('href');
	if(url.indexOf('q=') > -1){
		if($(location).attr('hash').indexOf('q=') > -1 || url.indexOf('tbm') === -1){
			console.log('web search');
			var web_search_injector = new WebSearchInjector();
			web_search_injector.inject();
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
