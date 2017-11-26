function parseFunction() {
    
	SwaggerParser.validate("swagger-5.yaml")
	.then(function(api) {
    
    
    var data = [{
      name : 'text',
      photoUrls: 'jhgj',
      xxx: 11
    }];
    
    var schema = api.paths["/pet/findByStatus"].get.responses[200].schema;
    
    
    var result = tv4.validateMultiple(data, schema, true, true);
    console.log(JSON.stringify(result));
    
    
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  })
  .catch(function(err) {
    console.error(err);
  });
        
}
    
    
function myFunction() {

    
    var schema = {
      "type": "object",
      "required": ["message"],
      "properties": {
        "message": {
          "type": "string",
            "required": true    
        },  
        "smaller": {
          "type": "number"
        },
        "larger": { "type": "number" }
      }
    };

    var data = {
      message : 'text',
      smaller: 4,
      larger: 7
    };
    
    
    var data2 = {
      smaller: 4,
      larger: 7,
      another: 'hmmmmmm'
    };
    
    var result = tv4.validateMultiple(data, schema, true, true);
    console.log(JSON.stringify(result));
    
    console.log('-------------------');
    
    var result = tv4.validateMultiple(data2, schema, true, true);
    console.log(JSON.stringify(result));
    
        console.log('-------------------');
    
    var result = tv4.validateMultiple(data2, schema, true, false);
    console.log(JSON.stringify(result));
    /*
	 *  :: data: {"message":":) Sample text","age":1} :: schema:
	 * {"type":"object","properties":{"message":{"type":"string","required":true},"larger":{"type":"number","required":true}}} ::
	 * result: { "errors":[ {"message":"Unknown property (not in schema)",
	 * "params":{"path":"/age"}, "code":1000, "dataPath":"/age", "schemaPath":""
	 * ,"subErrors":null} ], "missing":[],"valid":false}
	 * 
	 * 
	 * //const Ajv = require('Ajv'); const ajv = new Ajv({allErrors: true}); //
	 * Schema from the example above const validate = ajv.compile(schema);
	 * 
	 * const val = validate(data);
	 * 
	 * if (!val) { validate.errors.forEach(function(error) { console.log('ERROR: ' +
	 * error.dataPath + ': ' + error.message); }); };
	 * 
	 * 
	 *  // var ajv = new Ajv( { async: true } );
	 * 
	 * 
	 * 
	 * 
	 * console.log(validate(data)); // true console.log(data); // { "foo": 0,
	 * "bar": { "baz": "abc", "additional2": 2 }
	 * 
	 * 
	 */
    
}