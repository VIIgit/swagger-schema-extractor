var schemas = {
  "/cat.POST.request.param" : {
    "type" : "object",
    "title" : "body",
    "properties" : {
      "body" : {
        "type" : "object",
        "properties" : {
          "photoUrls" : {
            "type" : "array",
            "items" : {
              "type" : "string"
            }
          },
          "name" : {
            "type" : "string",
            "minLength" : 5,
            "maxLength" : 55
          },
          "id" : {
            "type" : "integer"
          },
          "category" : {
            "type" : "object",
            "properties" : {
              "name" : {
                "type" : "string"
              },
              "id" : {
                "type" : "integer"
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
                  "type" : "integer"
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
  },
  "/cat.POST.response.405" : { },
  "/cat.PUT.request.param" : {
    "type" : "object",
    "title" : "body",
    "properties" : {
      "body" : {
        "type" : "object",
        "properties" : {
          "photoUrls" : {
            "type" : "array",
            "items" : {
              "type" : "string"
            }
          },
          "name" : {
            "type" : "string",
            "minLength" : 5,
            "maxLength" : 55
          },
          "id" : {
            "type" : "integer"
          },
          "category" : {
            "type" : "object",
            "properties" : {
              "name" : {
                "type" : "string"
              },
              "id" : {
                "type" : "integer"
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
                  "type" : "integer"
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
  },
  "/cat.PUT.response.400" : { },
  "/cat.PUT.response.404" : { },
  "/cat.PUT.response.405" : { },
  "/pet/findByStatus/{statusId}.GET.request.param" : {
    "title" : "status",
    "properties" : {
      "statusId" : {
        "in" : "path",
        "type" : "string",
        "title" : "statusId",
        "minLength" : 2,
        "maxLength" : 5
      },
      "status" : {
        "in" : "query",
        "type" : "array",
        "title" : "status"
      }
    }
  },
  "/pet/findByStatus/{statusId}.GET.response.200" : {
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
          "type" : "string",
          "minLength" : 5,
          "maxLength" : 55
        },
        "id" : {
          "type" : "integer"
        },
        "category" : {
          "type" : "object",
          "properties" : {
            "name" : {
              "type" : "string"
            },
            "id" : {
              "type" : "integer"
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
                "type" : "integer"
              }
            }
          }
        },
        "status" : {
          "type" : "string"
        }
      }
    }
  },
  "/pet/findByStatus/{statusId}.GET.response.400" : { },
  "/pet/{petId}/uploadImage.POST.request.param" : {
    "title" : "file",
    "properties" : {
      "petId" : {
        "in" : "path",
        "type" : "integer",
        "title" : "petId"
      },
      "file" : {
        "in" : "formData",
        "type" : "file",
        "title" : "file"
      },
      "additionalMetadata" : {
        "in" : "formData",
        "type" : "string",
        "title" : "additionalMetadata"
      }
    }
  },
  "/pet/{petId}/uploadImage.POST.response.200" : {
    "type" : "object",
    "properties" : {
      "code" : {
        "type" : "integer"
      },
      "type" : {
        "type" : "string"
      },
      "message" : {
        "type" : "string"
      }
    }
  },
  "/store/inventory.GET.request.param" : { },
  "/store/inventory.GET.response.200" : {
    "type" : "object"
  }
}