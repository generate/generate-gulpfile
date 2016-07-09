<% if (typeof coverage !== 'undefined' && coverage === true) { %> 
  <%= gulptask('mocha-coverage') %> 
<% } else { %> 
  <%= gulptask('mocha-basic') %> 
<% } %>