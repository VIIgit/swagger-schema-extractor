package viigit.swagger.schema.extractor;

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
import io.swagger.models.parameters.AbstractSerializableParameter;
import io.swagger.models.parameters.BodyParameter;
import io.swagger.models.parameters.Parameter;
import io.swagger.models.properties.AbstractNumericProperty;
import io.swagger.models.properties.ArrayProperty;
import io.swagger.models.properties.BooleanProperty;
import io.swagger.models.properties.DateTimeProperty;
import io.swagger.models.properties.MapProperty;
import io.swagger.models.properties.Property;
import io.swagger.models.properties.RefProperty;
import io.swagger.models.properties.StringProperty;

public class SchemaExtractor {

	public Map<String, JsonSchema> extractSchema(Swagger swagger) {

		Map<String, JsonSchema> path = new TreeMap<>();

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
		Map<String, JsonSchema> paramTypeMap = new HashMap<>();

		List<Parameter> requestParams = httpOperation.getValue().getParameters();
		for (Parameter param : requestParams) {
			JsonSchema propSchema = new JsonSchema();

			if (param instanceof BodyParameter) {
				JsonSchema schema = new JsonSchema();
				BodyParameter bodyParam = (BodyParameter) param;
				schema.addProperty(bodyParam.getName(), propSchema);
				schema.type = "object";
				Model model = bodyParam.getSchema();
				extractModel(model, swagger, propSchema);
				path.put(entry.getKey() + "." + httpOperation.getKey().name() + ".request.body", schema);
			} else {
				AbstractSerializableParameter<?> abstractParam = (AbstractSerializableParameter<?>) param;

				propSchema.title = abstractParam.getName();
				propSchema.type = abstractParam.getType();
				propSchema.minimum = abstractParam.getMinimum();
				propSchema.maximum = abstractParam.getMaximum();
				propSchema.minLength = abstractParam.getMinLength();
				propSchema.maxLength = abstractParam.getMaxLength();

				JsonSchema jsonSchema = paramTypeMap.get(abstractParam.getIn());
				if (jsonSchema == null) {
					jsonSchema = new JsonSchema();
					jsonSchema.type = "object";
					paramTypeMap.put(abstractParam.getIn(), jsonSchema);
				}
				jsonSchema.addProperty(abstractParam.getName(), propSchema);
			}
		}

		for (Entry<String, JsonSchema> parameter : paramTypeMap.entrySet()) {
			path.put(entry.getKey() + "." + httpOperation.getKey().name() + ".request." + parameter.getKey(),
					parameter.getValue());
		}
	}

	private void parseResponses(Map<String, JsonSchema> path, Swagger swagger, Map.Entry<String, Path> entry,
			Map.Entry<HttpMethod, Operation> httpOperation) {
		Map<String, Response> responses = httpOperation.getValue().getResponses();
		for (Map.Entry<String, Response> response : responses.entrySet()) {

			JsonSchema schema = new JsonSchema();
			String key = entry.getKey() + "." + httpOperation.getKey().name() + ".response." + response.getKey();
			System.err.println(key);

			path.put(key, schema);

			if (response.getValue().getSchema() != null) {
				extractProperty(response.getValue().getSchema(), swagger, schema);
			}
		}
	}

	private void extractProperty(Property prop, Swagger swagger, JsonSchema schema) {

		schema.title = prop.getTitle();
		schema.type = prop.getType();
		schema.format = prop.getFormat();
		schema.readOnly = prop.getReadOnly();
		schema.required = prop.getRequired();

		if (prop instanceof AbstractNumericProperty) {
			AbstractNumericProperty abstractNumProp = (AbstractNumericProperty) prop;
			schema.minimum = abstractNumProp.getMinimum();
			schema.maximum = abstractNumProp.getMaximum();
		} else if (prop instanceof StringProperty) {
			StringProperty stringProp = (StringProperty) prop;
			schema.minLength = stringProp.getMinLength();
			schema.maxLength = stringProp.getMaxLength();
		} else if (prop instanceof BooleanProperty) {
			BooleanProperty booleanProp = (BooleanProperty) prop;
		} else if (prop instanceof DateTimeProperty) {
			DateTimeProperty dateProp = (DateTimeProperty) prop;
			schema.format = dateProp.getFormat();
			// dateProp.getPattern() is undefined for date
			if ("date-time-utc".equals(schema.format)) {
				schema.pattern = "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(Z|\\+\\d{2}:\\d{2})";
			} else if ("date-time".equals(schema.format)) {
				schema.pattern = "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}";
			} else if ("date".equals(schema.format)) {
				schema.pattern = "\\d{4}-\\d{2}-\\d{2}";
			}
		} else if (prop instanceof MapProperty) {
			MapProperty mapProperty = (MapProperty) prop;
			Property props = mapProperty.getAdditionalProperties();
			schema.additionalProperties = new JsonSchema();
			extractProperty(props, swagger, schema.additionalProperties);
		} else if ("array".equals(prop.getType())) {
			JsonSchema arraySchema = new JsonSchema();
			extractProperty((ArrayProperty) prop, swagger, arraySchema);
			schema.type = "array";
			schema.items = arraySchema;
		} else if ("ref".equals(prop.getType())) {
			extractRefProperty((RefProperty) prop, swagger, schema);
			schema.type = "object";
		} else {
			System.err.println(prop.toString());
			throw new RuntimeException("Property Type not supported:" + prop.getName() + " type:" + prop.getType());
		}
	}

	private void extractProperty(ArrayProperty prop, Swagger swagger, JsonSchema schema) {
		extractProperty(prop.getItems(), swagger, schema);
	}

	private void extractRefProperty(RefProperty prop, Swagger swagger, JsonSchema schema) {
		Model model = getModelByRef(prop.get$ref(), swagger, schema);
		extractModel(model, swagger, schema);
	}

	private void extractModel(Model model, Swagger swagger, JsonSchema schema) {
		if (model instanceof RefModel) {
			RefModel refModel = (RefModel) model;
			model = refModel.get$ref() != null ? getModelByRef(refModel.get$ref(), swagger, schema) : model;
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

	private Model getModelByRef(String ref, Swagger swagger, JsonSchema schema) {
		schema.type = "object";
		String[] split = ref.split("#/definitions/");
		return swagger.getDefinitions().get(split[1]);
	}

	private void extractModel(AbstractModel model, Swagger swagger, JsonSchema schema) {
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
