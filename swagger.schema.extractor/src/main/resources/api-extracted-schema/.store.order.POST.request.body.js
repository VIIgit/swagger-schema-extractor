{
  "type" : "object",
  "properties" : {
    "body" : {
      "type" : "object",
      "properties" : {
        "petId" : {
          "type" : "integer",
          "format" : "int64"
        },
        "quantity" : {
          "type" : "integer",
          "format" : "int32"
        },
        "id" : {
          "type" : "integer",
          "format" : "int64"
        },
        "shipDate" : {
          "type" : "string",
          "format" : "date-time",
          "pattern" : "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"
        },
        "complete" : {
          "type" : "boolean"
        },
        "status" : {
          "type" : "string"
        }
      }
    }
  }
}