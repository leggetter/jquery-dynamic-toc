# jQuery Dynamic Table of Contents

Maintaining a Table of Contents for a page can be a pain so sometimes it's nice if they are auto-generated for you.

This jQuery plugin lets you generate an alphabetically sorted dynamic table of contents containing items based on the text of the first matching element within each matched element. It also provides optional filter functionality so that the Table of Contents and the contents itself can be filtered from the page based on the contents of an `<input type="text" />` element.

# Usage:

The following:

	  <!-- This is where the table of contents is to appear -->
	  <div id="toc"></div>
	  
	  <!-- here are the items we want the dynamic toc to list -->
	  <div class="item">
	    <h2>First item</h2>
	    <p>I provide details about the first item within the page</p>
	  </div>
	  <div class="item">
	    <h2>Second item</h2>
	    <p>I provide details about the second item within the page.</p>
	  </div>
	  <div class="item">
	    <h2>Third item</h2>
	    <p>I provide details about the third and final item within the page.</p>
	  </div>
	  
	  <script>
	    $(function() {
	      $("div.item").dynamicToc({toc: "#toc", filter:true, debug: true});
	    });
	  </script>

Will show a Filter input and produce a table of contents:

* First item
* Second item
* Third item

Example:

An example is avalable within the `example` directory [here](../example/index.html).