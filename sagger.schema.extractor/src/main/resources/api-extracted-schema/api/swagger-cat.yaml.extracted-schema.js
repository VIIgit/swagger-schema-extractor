{
  "/cat.POST.request.body" : {
    "type" : "object",
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
  },
  "/cat.POST.response.405" : { },
  "/cat.PUT.request.body" : {
    "type" : "object",
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
  },
  "/cat.PUT.response.400" : { },
  "/cat.PUT.response.404" : { },
  "/cat.PUT.response.405" : { },
  "/pet/findByStatus/{statusId}.GET.request.path" : {
    "type" : "object",
    "properties" : {
      "statusId" : {
        "type" : "string",
        "title" : "statusId",
        "minLength" : 2,
        "maxLength" : 5
      }
    }
  },
  "/pet/findByStatus/{statusId}.GET.request.query" : {
    "type" : "object",
    "properties" : {
      "status" : {
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
  },
  "/pet/findByStatus/{statusId}.GET.response.400" : { },
  "/pet/{petId}/uploadImage.POST.request.formData" : {
    "type" : "object",
    "properties" : {
      "file" : {
        "type" : "file",
        "title" : "file"
      },
      "additionalMetadata" : {
        "type" : "string",
        "title" : "additionalMetadata"
      }
    }
  },
  "/pet/{petId}/uploadImage.POST.request.path" : {
    "type" : "object",
    "properties" : {
      "petId" : {
        "type" : "integer",
        "title" : "petId"
      }
    }
  },
  "/pet/{petId}/uploadImage.POST.response.200" : {
    "type" : "object",
    "properties" : {
      "code" : {
        "type" : "integer",
        "format" : "int32"
      },
      "type" : {
        "type" : "string"
      },
      "message" : {
        "type" : "string"
      }
    }
  },
  "/store/inventory.GET.response.200" : {
    "type" : "object",
    "additionalProperties" : {
      "type" : "integer",
      "format" : "int32"
    }
  }
}