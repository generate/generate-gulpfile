<% if (coverage === true) { %> 
  <%= gulptask("mocha-coverage") %> 
<% } else { %> 
  <%= gulptask("mocha-basic") %> 
<% } %>