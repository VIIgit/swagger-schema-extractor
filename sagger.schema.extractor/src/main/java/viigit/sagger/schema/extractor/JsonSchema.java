package viigit.sagger.schema.extractor;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class JsonSchema {
	public JsonSchema() {
	}

	public Boolean required;
	public Boolean readOnly;
	public String type;
	public String format;
	public String pattern;
	public String title;
	public Integer minLength;
	public Integer maxLength;
	public BigDecimal minimum;
	public BigDecimal maximum;
	public JsonSchema items;
	public JsonSchema additionalProperties;

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
