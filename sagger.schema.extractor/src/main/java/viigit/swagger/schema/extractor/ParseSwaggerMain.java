package viigit.swagger.schema.extractor;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import io.swagger.models.Swagger;
import io.swagger.parser.SwaggerParser;
import io.swagger.parser.SwaggerResolver;
import io.swagger.util.Json;

/**
 * Hello world!
 */
public class ParseSwaggerMain {

	private Map<String, Swagger> linkedSwaggers = new HashMap<>();

	public static void main(String[] args) throws URISyntaxException, IOException {

		if (args.length == 0) {
			// setup sample files
			args = new String[] { "/api/swagger-cat.yaml", "/api/swagger-pet.yaml" };
		}

		String sourceFolder = new File("").getAbsolutePath() + "/src/main/resources";
		String outputFolder = sourceFolder + "/api-extracted-schema/";

		ParseSwaggerMain parser = new ParseSwaggerMain();
		for (String swaggerFileName : args) {
			parser.parseSwagger(swaggerFileName, sourceFolder, outputFolder);
		}
	}

	private void parseSwagger(String swaggerFileName, String sourceFolder, String outputFolder) throws IOException {
		File swaggerFile = new File(sourceFolder + swaggerFileName);
		System.out.println("-------------------- " + swaggerFile.getAbsolutePath());
		Swagger swagger = getResolvedSwagger(swaggerFile);

		Map<String, JsonSchema> schemas = new SchemaExtractor().extractSchema(swagger);
		int i = 1;
		for (Map.Entry<String, JsonSchema> schemaEntry : schemas.entrySet()) {

			Path path = Paths
					.get(outputFolder + swaggerFileName + "/" + schemaEntry.getKey().replace("/", "_") + ".json");
			Files.createDirectories(path.getParent());
			Files.write(path, (Json.pretty(schemaEntry.getValue())).getBytes());
		}

		Path path = Paths.get(outputFolder + swaggerFileName + ".json");
		Files.createDirectories(path.getParent());
		Files.write(path, (Json.pretty(schemas)).getBytes());

		System.err.println(Json.pretty(schemas));
	}

	private Swagger getResolvedSwagger(File file) {
		Swagger swagger = linkedSwaggers.get(file.getAbsolutePath());

		if (swagger == null) {
			swagger = new SwaggerParser().read(file.getAbsolutePath());
			if (swagger == null) {
				throw new IllegalArgumentException("File not found: " + file.getAbsolutePath());
			}
			SwaggerResolver resolver = new SwaggerResolver(swagger, null);
			swagger = resolver.resolve();
			linkedSwaggers.put(file.getAbsolutePath(), swagger);
		}
		return swagger;
	}
}
