package viigit.sagger.schema.extractor;

import java.util.HashMap;
import java.util.Map;

public class JsonSchema {
	public JsonSchema() {
	}

	public String in;
	public Boolean required;
	public String type;
	public String title;
	public Integer minLength;
	public Integer maxLength;
	public Double minimum;
	public Double maximum;
	public JsonSchema items;

	public Map<String, JsonSchema> properties;

	private Map<String, JsonSchema> getProperties() {
		if (properties == null) {
			properties = new HashMap<>();
		}
		return properties;
	}

	public void addProperty(String name, JsonSchema schema) {
		getProperties().put(name, schema);
	}
}
