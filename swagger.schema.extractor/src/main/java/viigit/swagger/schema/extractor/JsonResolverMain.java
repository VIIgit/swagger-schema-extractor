package viigit.swagger.schema.extractor;

import java.nio.file.FileSystems;
import java.nio.file.Path;

import io.swagger.models.Swagger;
import io.swagger.parser.SwaggerParser;
import io.swagger.util.Json;

public class JsonResolverMain {

	public static void Main(String[] args) {

		Path yaml = FileSystems.getDefault().getPath("docs/api/example/swagger-simple-pet.yaml");

		SwaggerParser parser = new SwaggerParser();
		Swagger swagger = parser.read(yaml.toAbsolutePath().toString());

		String swaggerString = Json.pretty(swagger);

	}
}
