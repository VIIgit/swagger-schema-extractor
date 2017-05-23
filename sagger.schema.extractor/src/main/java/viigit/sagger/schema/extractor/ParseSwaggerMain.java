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

		parseSwagger("/src/main/resources/api/swagger-cat.yaml");
		parseSwagger("/src/main/resources/api/swagger-pet.yaml");
	}

	private static void parseSwagger(String swagger) throws IOException {
		String path = new File("").getAbsolutePath();
		Map<String, JsonSchema> schema = new SchemaExtractor().extractSchema(path + swagger);

		Files.write(Paths.get(path + swagger + ".schema.js"), ("var schemas = " + Json.pretty(schema)).getBytes());

		System.err.println(Json.pretty(schema));
	}
}
