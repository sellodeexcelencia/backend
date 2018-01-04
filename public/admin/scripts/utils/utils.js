angular.module('dmt-back').filter('translate', function () {
    return function (word, lang) {
		lang = lang || "es";
		var directory = dmt.translate[lang];
		return directory[word] || word;
    }
});
angular.module('dmt-back').filter('linkvalue', function () {
    return function (items, field, item) {
        for (i in items) {
            let it = items[i];
            if (item[field.name] === it[field.foreign_key]) {
                return it[field.foreign_name];
            }
        }
    }
});
angular.module('dmt-back').factory('Excel',function($window){
	var uri='data:application/vnd.ms-excel;base64,',
		template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
		base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
		format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
	return {
		tableToExcel:function(tableId,worksheetName){
			var table=document.querySelector(tableId),
				ctx={worksheet:worksheetName,table:table.innerHTML},
				href=uri+base64(format(template,ctx));
			return href;
		}
	};
})
function buildBreadcrum(path, page, breadcrum) {
	if(!breadcrum){
		breadcrum = "";
	}
	if (page) {
		var name = page.name ||  page.section;
		path = path.substr(0, path.lastIndexOf("/"));
		breadcrum = "<a href='#!" + path + "'> >" + name + "</a>" + breadcrum;
		page = page.parent;
		return buildBreadcrum(path, page, breadcrum);
	}
	return breadcrum;
}

function decodeBase64 (str) {
	let buffer;
	if (typeof module !== 'undefined' && module.exports) {
	  try {
		buffer = require('buffer').Buffer;
	  } catch (err) {
		// noop
	  }
	}
  
	let fromCharCode = String.fromCharCode;
  
	let re_btou = new RegExp([
	  '[\xC0-\xDF][\x80-\xBF]',
	  '[\xE0-\xEF][\x80-\xBF]{2}',
	  '[\xF0-\xF7][\x80-\xBF]{3}'
	].join('|'), 'g');
  
	let cb_btou = function (cccc) {
	  switch (cccc.length) {
		case 4:
		  let cp = ((0x07 & cccc.charCodeAt(0)) << 18)
			| ((0x3f & cccc.charCodeAt(1)) << 12)
			| ((0x3f & cccc.charCodeAt(2)) << 6)
			| (0x3f & cccc.charCodeAt(3));
		  let offset = cp - 0x10000;
		  return (fromCharCode((offset >>> 10) + 0xD800)
		  + fromCharCode((offset & 0x3FF) + 0xDC00));
		case 3:
		  return fromCharCode(
			((0x0f & cccc.charCodeAt(0)) << 12)
			| ((0x3f & cccc.charCodeAt(1)) << 6)
			| (0x3f & cccc.charCodeAt(2))
		  );
		default:
		  return fromCharCode(
			((0x1f & cccc.charCodeAt(0)) << 6)
			| (0x3f & cccc.charCodeAt(1))
		  );
	  }
	};
  
	let btou = function (b) {
	  return b.replace(re_btou, cb_btou);
	};
  
	let _decode = buffer ? function (a) {
	  return (a.constructor === buffer.constructor
		? a : new buffer(a, 'base64')).toString();
	}
	  : function (a) {
	  return btou(atob(a));
	};
  
	return _decode(
	  String(str).replace(/[-_]/g, function (m0) {
		return m0 === '-' ? '+' : '/';
	  })
		.replace(/[^A-Za-z0-9\+\/]/g, '')
	);
  }