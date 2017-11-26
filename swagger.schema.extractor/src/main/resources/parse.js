print('in');

SwaggerParser.dereference("./api/swagger-pet.yaml", null, function(api) {
    
	  print('ok dereference');
  
	  var schema = api.paths["/pet/findByStatus"].get.responses[200].schema;
	  
	  print('schema dereference');
	  
	  print( JSON.stringify(schema));
  
	}
);

print('out: ' + swaggerfile);


