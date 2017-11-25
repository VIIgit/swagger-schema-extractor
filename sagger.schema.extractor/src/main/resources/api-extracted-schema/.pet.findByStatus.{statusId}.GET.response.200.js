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
      "tagsOnly" : {
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
      "name" : {
        "type" : "string",
        "minLength" : 5,
        "maxLength" : 55
      },
      "id" : {
        "type" : "integer",
        "format" : "int64"
      },
      "category" : {
        "type" : "object",
        "properties" : {
          "refCat" : {
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
            "tagtagTag" : {
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