function WebSearchInjector(){
	var related_search_up_template = '';
	var related_search_down_template = '';
	var web_search_template = '';
	var web_result_template = '';
	var web_result_news_template = '';
	var web_result_data = '';

	var _init = function() {
		$.get(chrome.extension.getURL('./templates/related_search_up.html'), function(data){
			related_search_up_template = data;
		});
		$.get(chrome.extension.getURL('./templates/related_search_down.html'), function(data){
			related_search_down_template = data;
		});
		$.get(chrome.extension.getURL('./templates/web_search.html'), function(data){
			web_search_template = data;
		});
		$.get(chrome.extension.getURL('./templates/web_results.html'), function(data){
			web_result_template = data;
		});
		$.get(chrome.extension.getURL('./templates/web_result_news.html'), function(data){
			web_result_news_template = data;
		});
		$.get(chrome.extension.getURL('./data/web_results.json'), function(data){
			web_result_data = JSON.parse(data);
		});	
	};
	_init();

	var _create_related_search_up_dom = function(title){
		var template = related_search_up_template;
		template = template.replace('$TITLE$', title);
		return template;
	};

	var _create_related_search_down_dom = function(title){
		var template = related_search_down_template;
		template = template.replace('$TITLE$', title);
		return template;
	};

	var _create_web_result_dom = function(title, url, content){
		var template = web_result_template;
		template = template.replace('$TITLE$', title).replace('$URL$', url).replace('$CONTENT$', content);
		return template;
	};

	var _create_web_result_news_dom = function(title, img, paper_name, content){
		var template = web_result_news_template;
		template = template.
			replace('$TITLE$', title).
			replace('$IMG$', img).
			replace('$PAPER_NAME$', paper_name).
			replace('$CONTENT$', content);
		return template;
	};

	var _inject_related_search_up = function (){
		var inject_point_dom = $('.inject-related-search-up');
		var inject_data = web_result_data.related_search_up;
		for(i in inject_data){
			var inject_dom = _create_related_search_up_dom(inject_data[i]);
			inject_point_dom.append(inject_dom);
		}
	};

	var _inject_related_search_down = function (){
		var inject_point_dom = $('.inject-related-search-down-title');
		var inject_data = web_result_data.related_search_down.title;
		inject_point_dom.text(inject_data);

		inject_data = web_result_data.related_search_down.list;
		for(i in inject_data){
			if(i % 2 == 0){
				inject_point_dom = $('.inject-related-search-down-col-left');
			}
			else{
				inject_point_dom = $('.inject-related-search-down-col-right');
			}
			var inject_dom = _create_related_search_down_dom(inject_data[i]);
			inject_point_dom.append(inject_dom);
		}
	};

	var _inject_web_result_down = function (){
		var inject_point_dom = $('.inject-web-result-down');
		var inject_data = web_result_data.web_result_down;
		for(i in inject_data){
			var inject_dom = _create_web_result_dom(
				inject_data[i].title, 
				inject_data[i].url,
				inject_data[i].content);
			inject_point_dom.append(inject_dom);
		}
	};

	var _inject_web_result_up = function (){
		var inject_point_dom = $('.inject-web-result-up');
		var inject_data = web_result_data.web_result_up;
		for(i in inject_data){
			var inject_dom = _create_web_result_dom(
				inject_data[i].title, 
				inject_data[i].url,
				inject_data[i].content);
			inject_point_dom.append(inject_dom);
		}
	};

	var _inject_web_result_news = function (){
		var inject_point_dom = $('.inject-web-result-news');
		var inject_data = web_result_data.web_result_news;
		for(i in inject_data){
			var inject_dom = _create_web_result_news_dom(
				inject_data[i].title, 
				chrome.extension.getURL(inject_data[i].img),
				inject_data[i].paper_name,
				inject_data[i].content);
			inject_point_dom.append(inject_dom);
		}
	};

	var _replace_web_result = function (){
		$('div#rcnt').html(web_search_template);
		_inject_related_search_up();
		_inject_related_search_down();
		_inject_web_result_up();
		_inject_web_result_down();
		_inject_web_result_news();
	};

	var _listen_web_result = function (event){
		if(event.srcElement.id == 'fbar'){
			_replace_web_result();
		}
	};

	this.inject = function (){
		if($('div#ires div.srg')[0]){
			_replace_web_result();
		}
		else{
			$('div#main')[0].addEventListener('DOMNodeInserted', _listen_web_result);
		}
	};
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
