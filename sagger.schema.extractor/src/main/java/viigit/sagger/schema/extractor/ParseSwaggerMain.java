package viigit.sagger.schema.extractor;

import java.io.FileNotFoundException;
import java.net.URISyntaxException;
import java.util.Map;

import io.swagger.util.Json;

/**
 * Hello world!
 *
 */
public class ParseSwaggerMain {
	public static void main(String[] args) throws URISyntaxException, FileNotFoundException {

		Map<String, JsonSchema> schema = new SchemaExtractor().extractSchema(
				"/Users/erwin/git/swagger-schema-extractor/sagger.schema.extractor/src/main/resources/api/swagger-cat.yaml");
		System.err.println(Json.pretty(schema));

		Map<String, JsonSchema> schema2 = new SchemaExtractor().extractSchema("./api/swagger-pet.yaml");
		System.err.println(Json.pretty(schema2));
	}

}
