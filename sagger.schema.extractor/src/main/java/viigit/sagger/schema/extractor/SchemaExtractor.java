package viigit.sagger.schema.extractor;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;

import io.swagger.models.AbstractModel;
import io.swagger.models.ArrayModel;
import io.swagger.models.ComposedModel;
import io.swagger.models.HttpMethod;
import io.swagger.models.Model;
import io.swagger.models.ModelImpl;
import io.swagger.models.Operation;
import io.swagger.models.Path;
import io.swagger.models.RefModel;
import io.swagger.models.Response;
import io.swagger.models.Swagger;
import io.swagger.models.parameters.BodyParameter;
import io.swagger.models.parameters.Parameter;
import io.swagger.models.properties.ArrayProperty;
import io.swagger.models.properties.Property;
import io.swagger.models.properties.RefProperty;
import io.swagger.parser.SwaggerParser;

public class SchemaExtractor {

	private File swaggerFile;
	private Map<String, Swagger> linkedSwaggers = new HashMap<>();

	public Map<String, JsonSchema> extractSchema(String file) {

		swaggerFile = null;
		Map<String, JsonSchema> path = new TreeMap<>();

		Swagger swagger = getSwagger(file);

		Map<String, Path> paths = swagger.getPaths();

		for (Entry<String, Path> entry : paths.entrySet()) {
			Map<HttpMethod, Operation> operationMap = entry.getValue().getOperationMap();
			for (Map.Entry<HttpMethod, Operation> httpOperation : operationMap.entrySet()) {
				parseResponses(path, swagger, entry, httpOperation);
				parseRequestParameter(path, swagger, entry, httpOperation);
			}
		}
		return path;
	}

	private void parseRequestParameter(Map<String, JsonSchema> path, Swagger swagger, Map.Entry<String, Path> entry,
			Map.Entry<HttpMethod, Operation> httpOperation) {
		JsonSchema schema = new JsonSchema();
		List<Parameter> requestParams = httpOperation.getValue().getParameters();
		for (Parameter param : requestParams) {
			JsonSchema propSchema = new JsonSchema();

			if (param instanceof BodyParameter) {
				BodyParameter bodyParam = (BodyParameter) param;
				propSchema.title = bodyParam.getName();

				Model model = bodyParam.getSchema();
				extractModel(model, swagger, propSchema);
			}
			schema.title = param.getName();

			path.put(entry.getKey() + "." + httpOperation.getKey().name() + ".request.param", propSchema);

		}
	}

	private void parseResponses(Map<String, JsonSchema> path, Swagger swagger, Map.Entry<String, Path> entry,
			Map.Entry<HttpMethod, Operation> httpOperation) {
		Map<String, Response> responses = httpOperation.getValue().getResponses();
		for (Map.Entry<String, Response> response : responses.entrySet()) {

			JsonSchema schema = new JsonSchema();

			path.put(entry.getKey() + "." + httpOperation.getKey().name() + ".response." + response.getKey(), schema);

			if (response.getValue().getSchema() != null) {
				extractProperty(response.getValue().getSchema(), swagger, schema);
			}

		}
	}

	private Swagger getSwagger(String file) {
		Swagger swagger;
		if (swaggerFile == null) {
			swaggerFile = new File(file);
			swagger = new SwaggerParser().read(swaggerFile.getPath());
		} else {

			swagger = linkedSwaggers.get(file);
			if (swagger == null) {
				swagger = new SwaggerParser().read(swaggerFile.getParent() + "/" + file);
				if (swagger == null) {
					throw new IllegalArgumentException("File not found: " + swaggerFile.getPath() + "/" + file);
				}
				linkedSwaggers.put(file, swagger);
			}
		}
		return swagger;
	}

	private void extractProperty(Property prop, Swagger swagger, JsonSchema schema) {

		extractCommonPropertyAttributes(prop, swagger, schema);

		if ("array".equals(prop.getType())) {
			JsonSchema arraySchema = new JsonSchema();
			extractProperty((ArrayProperty) prop, swagger, arraySchema);
			schema.type = "array";
			schema.items = arraySchema;

		} else if ("ref".equals(prop.getType())) {
			extractRefProperty((RefProperty) prop, swagger, schema);
			schema.type = "object";
		}

	}

	private void extractCommonPropertyAttributes(Property prop, Swagger swagger, JsonSchema schema) {
		schema.title = prop.getTitle();
		schema.type = prop.getType();
	}

	private void extractProperty(ArrayProperty prop, Swagger swagger, JsonSchema schema) {
		extractProperty(prop.getItems(), swagger, schema);
	}

	private void extractRefProperty(RefProperty prop, Swagger swagger, JsonSchema schema) {
		Model model = swagger.getDefinitions().get(prop.get$ref());
		extractModel(model, swagger, schema);
	}

	private void extractModel(Model model, Swagger swagger, JsonSchema schema) {
		if (model instanceof RefModel) {
			RefModel refModel = (RefModel) model;
			model = refModel.get$ref() != null ? swagger.getDefinitions().get(refModel.get$ref()) : model;
			extractModel((AbstractModel) model, swagger, schema);
		} else if (model instanceof ModelImpl) {
			extractModel((AbstractModel) model, swagger, schema);
		} else if (model instanceof ComposedModel) {
			ComposedModel composed = (ComposedModel) model;
			List<Model> allOf = composed.getAllOf();
			for (Model oneOfModel : allOf) {
				extractModel(oneOfModel, swagger, schema);
			}
			List<RefModel> interfacesModel = composed.getInterfaces();
			for (RefModel interfaceModel : interfacesModel) {
				extractModel(interfaceModel, swagger, schema);
			}
		} else if (model instanceof ArrayModel) {
			ArrayModel arrModel = ((ArrayModel) model);
			extractProperty(arrModel.getItems(), swagger, schema);
		} else {
			throw new RuntimeException("Model unsupported: " + model.getClass());
		}

	}

	private void extractModel(AbstractModel model, Swagger swagger, JsonSchema schema) {

		schema.type = "object";

		Map<String, Property> properties = model.getProperties();

		if (properties != null) {

			for (Map.Entry<String, Property> entry : properties.entrySet()) {
				JsonSchema paramSchema = new JsonSchema();
				schema.addProperty(entry.getKey(), paramSchema);
				extractProperty(entry.getValue(), swagger, paramSchema);
			}
		}

	}

}
