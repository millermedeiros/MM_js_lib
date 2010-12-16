/**
 * @namespace String Utilities for HTML manipulation
 * @author Miller Medeiros
 * @version 0.0.1 (2010/12/15)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
millermedeiros.htmlUtils = {
	
	/**
	 * Convert line breaks into 'br' tags (same as PHP nl2br)
	 * @param {string} str
	 * @param {boolean} [isHTML] defaults to `true`
	 * @return {string}
	 */
	nl2br : function(str, isXHTML){
		var br = (isXHTML !== false)? '<br />' : '<br>';
		return str.replace(/\n/g, br+'\n');
	},
	
	/**
	 * Wrap each line with and XML tag
	 * - ported from Miller Medeiros Eclipse Monkey Script Wrap Lines in Tag
	 * @param {string} str
	 * @param {string} tagName
	 * @return {string} 
	 */
	wrapLinesInTag : function(str, tagName){
		return str.replace(/([^\t\n\r]+)([\n\r]+|$)/g, '<'+ tagName +'>$1</'+ tagName +'>$2');
	},
	
	/**
	 * Remove HTML tags from string.
	 * @param {string} str
	 * @return {string}
	 */
	stripHtmlTags : function(str){
		return str.replace(/<[^>]*>/g, '');
	},
	
	/**
	 * Convert all applicable characters to HTML entities
	 * - based on Miller Medeiros Eclipse Monkey Scripts
	 * @param {string} str
	 * @param {boolean} ignoreHtmlTags	if it should keep HTML tags and attributes. 
	 * @return {string}
	 */
	htmlEntityEncode : function(str, ignoreHtmlTags){
		
		var 
			tmpArr,
		
			tagPattern = /(<[^>]+>)/g, //will match XML tags. capturing group is required for split.
			
			i,
			
			n,
		
			//encode special chars
			encode = function(str){
				//entities copied from Wikipedia ( http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Character_entity_references_in_HTML )
				return str
							.replace(/\u0026([a-zA-Z]+;)?/g, function($0, $1){
								return $1? $0 : "&amp;"; //make sure it only replace '&' if it isn't an HTML entity already
							})
							.replace(/\u0022/g, "&quot;")
							.replace(/\u0027/g, "&apos;")
							.replace(/\u003C/g, "&lt;")
							.replace(/\u003E/g, "&gt;")
							.replace(/\u00A0/g, "&nbsp;")
							.replace(/\u00A1/g, "&iexcl;")
							.replace(/\u00A2/g, "&cent;")
							.replace(/\u00A3/g, "&pound;")
							.replace(/\u00A4/g, "&curren;")
							.replace(/\u00A5/g, "&yen;")
							.replace(/\u00A6/g, "&brvbar;")
							.replace(/\u00A7/g, "&sect;")
							.replace(/\u00A8/g, "&uml;")
							.replace(/\u00A9/g, "&copy;")
							.replace(/\u00AA/g, "&ordf;")
							.replace(/\u00AB/g, "&laquo;")
							.replace(/\u00AC/g, "&not;")
							.replace(/\u00AD/g, "&shy;")
							.replace(/\u00AE/g, "&reg;")
							.replace(/\u00AF/g, "&macr;")
							.replace(/\u00B0/g, "&deg;")
							.replace(/\u00B1/g, "&plusmn;")
							.replace(/\u00B2/g, "&sup2;")
							.replace(/\u00B3/g, "&sup3;")
							.replace(/\u00B4/g, "&acute;")
							.replace(/\u00B5/g, "&micro;")
							.replace(/\u00B6/g, "&para;")
							.replace(/\u00B7/g, "&middot;")
							.replace(/\u00B8/g, "&cedil;")
							.replace(/\u00B9/g, "&sup1;")
							.replace(/\u00BA/g, "&ordm;")
							.replace(/\u00BB/g, "&raquo;")
							.replace(/\u00BC/g, "&frac14;")
							.replace(/\u00BD/g, "&frac12;")
							.replace(/\u00BE/g, "&frac34;")
							.replace(/\u00BF/g, "&iquest;")
							.replace(/\u00C0/g, "&Agrave;")
							.replace(/\u00C1/g, "&Aacute;")
							.replace(/\u00C2/g, "&Acirc;")
							.replace(/\u00C3/g, "&Atilde;")
							.replace(/\u00C4/g, "&Auml;")
							.replace(/\u00C5/g, "&Aring;")
							.replace(/\u00C6/g, "&AElig;")
							.replace(/\u00C7/g, "&Ccedil;")
							.replace(/\u00C8/g, "&Egrave;")
							.replace(/\u00C9/g, "&Eacute;")
							.replace(/\u00CA/g, "&Ecirc;")
							.replace(/\u00CB/g, "&Euml;")
							.replace(/\u00CC/g, "&Igrave;")
							.replace(/\u00CD/g, "&Iacute;")
							.replace(/\u00CE/g, "&Icirc;")
							.replace(/\u00CF/g, "&Iuml;")
							.replace(/\u00D0/g, "&ETH;")
							.replace(/\u00D1/g, "&Ntilde;")
							.replace(/\u00D2/g, "&Ograve;")
							.replace(/\u00D3/g, "&Oacute;")
							.replace(/\u00D4/g, "&Ocirc;")
							.replace(/\u00D5/g, "&Otilde;")
							.replace(/\u00D6/g, "&Ouml;")
							.replace(/\u00D7/g, "&times;")
							.replace(/\u00D8/g, "&Oslash;")
							.replace(/\u00D9/g, "&Ugrave;")
							.replace(/\u00DA/g, "&Uacute;")
							.replace(/\u00DB/g, "&Ucirc;")
							.replace(/\u00DC/g, "&Uuml;")
							.replace(/\u00DD/g, "&Yacute;")
							.replace(/\u00DE/g, "&THORN;")
							.replace(/\u00DF/g, "&szlig;")
							.replace(/\u00E0/g, "&agrave;")
							.replace(/\u00E1/g, "&aacute;")
							.replace(/\u00E2/g, "&acirc;")
							.replace(/\u00E3/g, "&atilde;")
							.replace(/\u00E4/g, "&auml;")
							.replace(/\u00E5/g, "&aring;")
							.replace(/\u00E6/g, "&aelig;")
							.replace(/\u00E7/g, "&ccedil;")
							.replace(/\u00E8/g, "&egrave;")
							.replace(/\u00E9/g, "&eacute;")
							.replace(/\u00EA/g, "&ecirc;")
							.replace(/\u00EB/g, "&euml;")
							.replace(/\u00EC/g, "&igrave;")
							.replace(/\u00ED/g, "&iacute;")
							.replace(/\u00EE/g, "&icirc;")
							.replace(/\u00EF/g, "&iuml;")
							.replace(/\u00F0/g, "&eth;")
							.replace(/\u00F1/g, "&ntilde;")
							.replace(/\u00F2/g, "&ograve;")
							.replace(/\u00F3/g, "&oacute;")
							.replace(/\u00F4/g, "&ocirc;")
							.replace(/\u00F5/g, "&otilde;")
							.replace(/\u00F6/g, "&ouml;")
							.replace(/\u00F7/g, "&divide;")
							.replace(/\u00F8/g, "&oslash;")
							.replace(/\u00F9/g, "&ugrave;")
							.replace(/\u00FA/g, "&uacute;")
							.replace(/\u00FB/g, "&ucirc;")
							.replace(/\u00FC/g, "&uuml;")
							.replace(/\u00FD/g, "&yacute;")
							.replace(/\u00FE/g, "&thorn;")
							.replace(/\u00FF/g, "&yuml;")
							.replace(/\u0152/g, "&OElig;")
							.replace(/\u0153/g, "&oelig;")
							.replace(/\u0160/g, "&Scaron;")
							.replace(/\u0161/g, "&scaron;")
							.replace(/\u0178/g, "&Yuml;")
							.replace(/\u0192/g, "&fnof;")
							.replace(/\u02C6/g, "&circ;")
							.replace(/\u02DC/g, "&tilde;")
							.replace(/\u0391/g, "&Alpha;")
							.replace(/\u0392/g, "&Beta;")
							.replace(/\u0393/g, "&Gamma;")
							.replace(/\u0394/g, "&Delta;")
							.replace(/\u0395/g, "&Epsilon;")
							.replace(/\u0396/g, "&Zeta;")
							.replace(/\u0397/g, "&Eta;")
							.replace(/\u0398/g, "&Theta;")
							.replace(/\u0399/g, "&Iota;")
							.replace(/\u039A/g, "&Kappa;")
							.replace(/\u039B/g, "&Lambda;")
							.replace(/\u039C/g, "&Mu;")
							.replace(/\u039D/g, "&Nu;")
							.replace(/\u039E/g, "&Xi;")
							.replace(/\u039F/g, "&Omicron;")
							.replace(/\u03A0/g, "&Pi;")
							.replace(/\u03A1/g, "&Rho;")
							.replace(/\u03A3/g, "&Sigma;")
							.replace(/\u03A4/g, "&Tau;")
							.replace(/\u03A5/g, "&Upsilon;")
							.replace(/\u03A6/g, "&Phi;")
							.replace(/\u03A7/g, "&Chi;")
							.replace(/\u03A8/g, "&Psi;")
							.replace(/\u03A9/g, "&Omega;")
							.replace(/\u03B1/g, "&alpha;")
							.replace(/\u03B2/g, "&beta;")
							.replace(/\u03B3/g, "&gamma;")
							.replace(/\u03B4/g, "&delta;")
							.replace(/\u03B5/g, "&epsilon;")
							.replace(/\u03B6/g, "&zeta;")
							.replace(/\u03B7/g, "&eta;")
							.replace(/\u03B8/g, "&theta;")
							.replace(/\u03B9/g, "&iota;")
							.replace(/\u03BA/g, "&kappa;")
							.replace(/\u03BB/g, "&lambda;")
							.replace(/\u03BC/g, "&mu;")
							.replace(/\u03BD/g, "&nu;")
							.replace(/\u03BE/g, "&xi;")
							.replace(/\u03BF/g, "&omicron;")
							.replace(/\u03C0/g, "&pi;")
							.replace(/\u03C1/g, "&rho;")
							.replace(/\u03C2/g, "&sigmaf;")
							.replace(/\u03C3/g, "&sigma;")
							.replace(/\u03C4/g, "&tau;")
							.replace(/\u03C5/g, "&upsilon;")
							.replace(/\u03C6/g, "&phi;")
							.replace(/\u03C7/g, "&chi;")
							.replace(/\u03C8/g, "&psi;")
							.replace(/\u03C9/g, "&omega;")
							.replace(/\u03D1/g, "&thetasym;")
							.replace(/\u03D2/g, "&upsih;")
							.replace(/\u03D6/g, "&piv;")
							.replace(/\u2002/g, "&ensp;")
							.replace(/\u2003/g, "&emsp;")
							.replace(/\u2009/g, "&thinsp;")
							.replace(/\u200C/g, "&zwnj;")
							.replace(/\u200D/g, "&zwj;")
							.replace(/\u200E/g, "&lrm;")
							.replace(/\u200F/g, "&rlm;")
							.replace(/\u2013/g, "&ndash;")
							.replace(/\u2014/g, "&mdash;")
							.replace(/\u2018/g, "&lsquo;")
							.replace(/\u2019/g, "&rsquo;")
							.replace(/\u201A/g, "&sbquo;")
							.replace(/\u201C/g, "&ldquo;")
							.replace(/\u201D/g, "&rdquo;")
							.replace(/\u201E/g, "&bdquo;")
							.replace(/\u2020/g, "&dagger;")
							.replace(/\u2021/g, "&Dagger;")
							.replace(/\u2022/g, "&bull;")
							.replace(/\u2026/g, "&hellip;")
							.replace(/\u2030/g, "&permil;")
							.replace(/\u2032/g, "&prime;")
							.replace(/\u2033/g, "&Prime;")
							.replace(/\u2039/g, "&lsaquo;")
							.replace(/\u203A/g, "&rsaquo;")
							.replace(/\u203E/g, "&oline;")
							.replace(/\u2044/g, "&frasl;")
							.replace(/\u20AC/g, "&euro;")
							.replace(/\u2111/g, "&image;")
							.replace(/\u2118/g, "&weierp;")
							.replace(/\u211C/g, "&real;")
							.replace(/\u2122/g, "&trade;")
							.replace(/\u2135/g, "&alefsym;")
							.replace(/\u2190/g, "&larr;")
							.replace(/\u2191/g, "&uarr;")
							.replace(/\u2192/g, "&rarr;")
							.replace(/\u2193/g, "&darr;")
							.replace(/\u2194/g, "&harr;")
							.replace(/\u21B5/g, "&crarr;")
							.replace(/\u21D0/g, "&lArr;")
							.replace(/\u21D1/g, "&uArr;")
							.replace(/\u21D2/g, "&rArr;")
							.replace(/\u21D3/g, "&dArr;")
							.replace(/\u21D4/g, "&hArr;")
							.replace(/\u2200/g, "&forall;")
							.replace(/\u2202/g, "&part;")
							.replace(/\u2203/g, "&exist;")
							.replace(/\u2205/g, "&empty;")
							.replace(/\u2207/g, "&nabla;")
							.replace(/\u2208/g, "&isin;")
							.replace(/\u2209/g, "&notin;")
							.replace(/\u220B/g, "&ni;")
							.replace(/\u220F/g, "&prod;")
							.replace(/\u2211/g, "&sum;")
							.replace(/\u2212/g, "&minus;")
							.replace(/\u2217/g, "&lowast;")
							.replace(/\u221A/g, "&radic;")
							.replace(/\u221D/g, "&prop;")
							.replace(/\u221E/g, "&infin;")
							.replace(/\u2220/g, "&ang;")
							.replace(/\u2227/g, "&and;")
							.replace(/\u2228/g, "&or;")
							.replace(/\u2229/g, "&cap;")
							.replace(/\u222A/g, "&cup;")
							.replace(/\u222B/g, "&int;")
							.replace(/\u2234/g, "&there4;")
							.replace(/\u223C/g, "&sim;")
							.replace(/\u2245/g, "&cong;")
							.replace(/\u2248/g, "&asymp;")
							.replace(/\u2260/g, "&ne;")
							.replace(/\u2261/g, "&equiv;")
							.replace(/\u2264/g, "&le;")
							.replace(/\u2265/g, "&ge;")
							.replace(/\u2282/g, "&sub;")
							.replace(/\u2283/g, "&sup;")
							.replace(/\u2284/g, "&nsub;")
							.replace(/\u2286/g, "&sube;")
							.replace(/\u2287/g, "&supe;")
							.replace(/\u2295/g, "&oplus;")
							.replace(/\u2297/g, "&otimes;")
							.replace(/\u22A5/g, "&perp;")
							.replace(/\u22C5/g, "&sdot;")
							.replace(/\u2308/g, "&lceil;")
							.replace(/\u2309/g, "&rceil;")
							.replace(/\u230A/g, "&lfloor;")
							.replace(/\u230B/g, "&rfloor;")
							.replace(/\u2329/g, "&lang;")
							.replace(/\u232A/g, "&rang;")
							.replace(/\u25CA/g, "&loz;")
							.replace(/\u2660/g, "&spades;")
							.replace(/\u2663/g, "&clubs;")
							.replace(/\u2665/g, "&hearts;")
							.replace(/\u2666/g, "&diams;");
			};
		
		if (! ignoreHtmlTags){
			return encode(str); 
		}else{
			tmpArr = str.split(tagPattern);
			n = tmpArr.length;
			for(i = 0; i < n; i++){
				tmpArr[i] = tagPattern.test(tmpArr[i])? tmpArr[i] : encode(tmpArr[i]); //keep html tags, encode regular string
			}
			return tmpArr.join('');
		}
		
	}
	
};