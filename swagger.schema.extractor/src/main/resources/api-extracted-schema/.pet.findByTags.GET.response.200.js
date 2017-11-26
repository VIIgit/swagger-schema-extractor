{
  "type" : "array",
  "items" : {
    "type" : "object",
    "properties" : {
      "photoUrls" : {
        "type" : "array",
        "items" : {
          "type" : "string"
        }
      },
      "name" : {
        "type" : "string"
      },
      "id" : {
        "type" : "integer",
        "format" : "int64"
      },
      "category" : {
        "type" : "object",
        "properties" : {
          "name" : {
            "type" : "string"
          },
          "id" : {
            "type" : "integer",
            "format" : "int64"
          }
        }
      },
      "tags" : {
        "type" : "array",
        "items" : {
          "type" : "object",
          "properties" : {
            "name" : {
              "type" : "string"
            },
            "id" : {
              "type" : "integer",
              "format" : "int64"
            }
          }
        }
      },
      "status" : {
        "type" : "string"
      }
    }
  }
}