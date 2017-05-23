package viigit.sagger.schema.extractor;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

import io.swagger.util.Json;

/**
 * Hello world!
 *
 */
public class ParseSwaggerMain {
	public static void main(String[] args) throws URISyntaxException, IOException {

		String path = new File("").getAbsolutePath();
		Map<String, JsonSchema> schema = new SchemaExtractor()
				.extractSchema(path + "/src/main/resources/api/swagger-cat.yaml");

		Files.write(Paths.get(path + "/gen/cat-schema.js"), ("var schemas = " + Json.pretty(schema)).getBytes());

		System.err.println(Json.pretty(schema));

		Map<String, JsonSchema> schema2 = new SchemaExtractor()
				.extractSchema(path + "/src/main/resources/api/swagger-pet.yaml");

		Files.write(Paths.get(path + "/gen/pet-schema.js"), ("var schemas = " + Json.pretty(schema2)).getBytes());

		System.err.println(Json.pretty(schema2));
	}

}
