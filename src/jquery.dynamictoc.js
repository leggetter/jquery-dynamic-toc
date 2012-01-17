(function($) {
  
  $.fn.dynamicToc = function(options) {
    
    ++$.fn.dynamicToc._count;
    
    options = options || {};
    var defaults = {
      sort: true, // boolean: if the items should be sorted in the toc and within the page content
      debug: false, // boolean: output debug information to console
      filterInput: null, // a selector: the input element to be used to filter the ToC and content.
      title: ':first', // a selector: Where the title text for each ToC entry is taken from. Default is take from `first`.
      filterOn: null // a selector: when a user enters input into the `filterInput` this determines
                     // what element should the filter find and look for a match within. The filter will be applied
                     // to the current item. By default no filterOn is applied and the match is applied within the current item.
    };
    var settings = $.extend( defaults, options);

    function debug(msg) {
      if(options.debug) {
        //$(document.body).append(msg + "<br />");
         console.log(msg);
      }
    }
    
    var items = $(this);
    debug("number of items to include in toc: " + items.size());

    if(items.size() === 0) {
      debug("not matching items found.");
      return;
    }
  
    var dynamicTocList = $(settings.toc || $(items[0]).parent()); // where to display toc
    var filterInput = null;
    if(settings.filter) {
      if(!settings.filterInput) {
        var el = createFilterInput();
        filterInput = el.find('input');
        dynamicTocList.append(el);
      }
      else {
        filterInput = $(settings.filterInput);
      }
    }
    debug('filterInput: ' + (filterInput?filterInput.size(): 'none'));
  
    if(settings.sort) {
      items.sortElements(function(a, b) {
        var aText = getItemTitle( $(a) );
        var bText = getItemTitle( $(b) ); 
        var compare = aText > bText;
        debug("comparing '" + aText + "' v '" + bText + "' = " + compare);
      
        return compare;
      });
    }

    var list = $("<ul class='dynamic-toc'>");
    items.each(function(index, item) {
      item = $(item);
      var title = getItemTitle( item );
      var itemId = item.attr("id");
      if(itemId === undefined || itemId.length === 0) {
        itemId = "_dynamicToc_" + $.fn.dynamicToc._count + "_" + index;
        item.attr("id", itemId)
      }
      var tocItem = $("<li title='" + title + "'>" +  
                        "<a href='#" + itemId + "'>" + title + "</a>" +
                      "</li>");
      list.append(tocItem);
    });
    dynamicTocList.append(list);
  
    var allItems = list.find("li");
    debug(allItems.size() + " toc items created");
  
    dynamicTocList.delay(1000).slideDown('slow');
  
    if( filterInput ) {
      filterInput.keyup(function() {
        var val = $.trim( $(this).val() ).toUpperCase();
        var vals = val.split(" ");
        
        showAll();
      
        debug("matching " + val);
        if(vals.length > 0){
        
          var hiding = 0;
          var toCheck;
          var filterOn;
          items.each(function(index, item) {
            item = $(item);
            toCheck = ""
            if(settings.filterOn) {
              filterOn = item.find(settings.filterOn);
              toCheck = getItemTitle(item) + " " +
                        filterOn.text();
            }
            else {
              toCheck = item.text();
            }
            toCheck = toCheck.toUpperCase();
            for(var i = 0, l = vals.length; i < l; ++i){
              var checkWith = vals[i];
              if(toCheck.indexOf(checkWith) < 0) {
                ++hiding;
                item.hide();
                var tocItems = allItems.has("a[href='#" + item.attr("id") + "']");
                debug("found " + tocItems.size() + " toc items");
                tocItems.hide();
                if(filterOn) {
                  filterOn.hide();
                }
              }
            }
          
          });
          debug("hiding " + hiding + "/" + items.size());
        }
      });
    }

    function showAll() {
      items.show();
      allItems.show();
      if(settings.filterOn) {
        items.each(function(index, item) {
          $(item).find(settings.filterOn).show();
        });
      }
    };

    function getItemTitle(item) {
      var title = item.find(settings.title).text();
      if(!title) {
        title = item.text();
      }
      return title;
    };

    function createFilterInput() {
      var html = '<div class="dynamictoc-filter">' +
                    '<label>Find</label>' +
                    '<input type="text" />' +
                  '</div>';
      return $(html);
    };
  };

  $.fn.dynamicToc._count = 0;
  
})(jQuery);

/**
 * jQuery.fn.sortElements
 * --------------
 * @param Function comparator:
 *   Exactly the same behaviour as [1,2,3].sort(comparator)
 *   
 * @param Function getSortable
 *   A function that should return the element that is
 *   to be sorted. The comparator will run on the
 *   current collection, but you may want the actual
 *   resulting sort to occur on a parent or another
 *   associated element.
 *   
 *   E.g. $('td').sortElements(comparator, function(){
 *      return this.parentNode; 
 *   })
 *   
 *   The <td>'s parent (<tr>) will be sorted instead
 *   of the <td> itself.
 */
jQuery.fn.sortElements = (function(){

    var sort = [].sort;

    return function(comparator, getSortable) {

        getSortable = getSortable || function(){return this;};

        var placements = this.map(function(){

            var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,

                // Since the element itself will change position, we have
                // to have some way of storing its original position in
                // the DOM. The easiest way is to have a 'flag' node:
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );

            return function() {

                if (parentNode === this) {
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }

                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);

            };

        });

        return sort.call(this, comparator).each(function(i){
            placements[i].call(getSortable.call(this));
        });

    };

})();