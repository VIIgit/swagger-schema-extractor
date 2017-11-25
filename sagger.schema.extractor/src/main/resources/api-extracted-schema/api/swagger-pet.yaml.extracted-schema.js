{
  "/pet.POST.request.body" : {
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
  },
  "/pet.POST.response.405" : { },
  "/pet.PUT.request.body" : {
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
  },
  "/pet.PUT.response.400" : { },
  "/pet.PUT.response.404" : { },
  "/pet.PUT.response.405" : { },
  "/pet/findByStatus.GET.request.query" : {
    "type" : "object",
    "properties" : {
      "status" : {
        "type" : "array",
        "title" : "status"
      }
    }
  },
  "/pet/findByStatus.GET.response.200" : {
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
  },
  "/pet/findByStatus.GET.response.400" : { },
  "/pet/findByTags.GET.request.query" : {
    "type" : "object",
    "properties" : {
      "tags" : {
        "type" : "array",
        "title" : "tags"
      }
    }
  },
  "/pet/findByTags.GET.response.200" : {
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
  },
  "/pet/findByTags.GET.response.400" : { },
  "/pet/{petId}.DELETE.request.header" : {
    "type" : "object",
    "properties" : {
      "api_key" : {
        "type" : "string",
        "title" : "api_key"
      }
    }
  },
  "/pet/{petId}.DELETE.request.path" : {
    "type" : "object",
    "properties" : {
      "petId" : {
        "type" : "integer",
        "title" : "petId"
      }
    }
  },
  "/pet/{petId}.DELETE.response.400" : { },
  "/pet/{petId}.DELETE.response.404" : { },
  "/pet/{petId}.GET.request.path" : {
    "type" : "object",
    "properties" : {
      "petId" : {
        "type" : "integer",
        "title" : "petId"
      }
    }
  },
  "/pet/{petId}.GET.response.200" : {
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
  },
  "/pet/{petId}.GET.response.400" : { },
  "/pet/{petId}.GET.response.404" : { },
  "/pet/{petId}.POST.request.formData" : {
    "type" : "object",
    "properties" : {
      "name" : {
        "type" : "string",
        "title" : "name"
      },
      "status" : {
        "type" : "string",
        "title" : "status"
      }
    }
  },
  "/pet/{petId}.POST.request.path" : {
    "type" : "object",
    "properties" : {
      "petId" : {
        "type" : "integer",
        "title" : "petId"
      }
    }
  },
  "/pet/{petId}.POST.response.405" : { },
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
  },
  "/store/order.POST.request.body" : {
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
  },
  "/store/order.POST.response.200" : {
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
  },
  "/store/order.POST.response.400" : { },
  "/store/order/{orderId}.DELETE.request.path" : {
    "type" : "object",
    "properties" : {
      "orderId" : {
        "type" : "integer",
        "title" : "orderId",
        "minimum" : 1.0
      }
    }
  },
  "/store/order/{orderId}.DELETE.response.400" : { },
  "/store/order/{orderId}.DELETE.response.404" : { },
  "/store/order/{orderId}.GET.request.path" : {
    "type" : "object",
    "properties" : {
      "orderId" : {
        "type" : "integer",
        "title" : "orderId",
        "minimum" : 1.0,
        "maximum" : 10.0
      }
    }
  },
  "/store/order/{orderId}.GET.response.200" : {
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
  },
  "/store/order/{orderId}.GET.response.400" : { },
  "/store/order/{orderId}.GET.response.404" : { },
  "/user.POST.request.body" : {
    "type" : "object",
    "properties" : {
      "body" : {
        "type" : "object",
        "properties" : {
          "firstName" : {
            "type" : "string"
          },
          "lastName" : {
            "type" : "string"
          },
          "password" : {
            "type" : "string"
          },
          "userStatus" : {
            "type" : "integer",
            "format" : "int32"
          },
          "phone" : {
            "type" : "string"
          },
          "id" : {
            "type" : "integer",
            "format" : "int64"
          },
          "email" : {
            "type" : "string"
          },
          "username" : {
            "type" : "string"
          }
        }
      }
    }
  },
  "/user.POST.response.default" : { },
  "/user/createWithArray.POST.request.body" : {
    "type" : "object",
    "properties" : {
      "body" : {
        "type" : "object",
        "properties" : {
          "firstName" : {
            "type" : "string"
          },
          "lastName" : {
            "type" : "string"
          },
          "password" : {
            "type" : "string"
          },
          "userStatus" : {
            "type" : "integer",
            "format" : "int32"
          },
          "phone" : {
            "type" : "string"
          },
          "id" : {
            "type" : "integer",
            "format" : "int64"
          },
          "email" : {
            "type" : "string"
          },
          "username" : {
            "type" : "string"
          }
        }
      }
    }
  },
  "/user/createWithArray.POST.response.default" : { },
  "/user/createWithList.POST.request.body" : {
    "type" : "object",
    "properties" : {
      "body" : {
        "type" : "object",
        "properties" : {
          "firstName" : {
            "type" : "string"
          },
          "lastName" : {
            "type" : "string"
          },
          "password" : {
            "type" : "string"
          },
          "userStatus" : {
            "type" : "integer",
            "format" : "int32"
          },
          "phone" : {
            "type" : "string"
          },
          "id" : {
            "type" : "integer",
            "format" : "int64"
          },
          "email" : {
            "type" : "string"
          },
          "username" : {
            "type" : "string"
          }
        }
      }
    }
  },
  "/user/createWithList.POST.response.default" : { },
  "/user/login.GET.request.query" : {
    "type" : "object",
    "properties" : {
      "password" : {
        "type" : "string",
        "title" : "password"
      },
      "username" : {
        "type" : "string",
        "title" : "username"
      }
    }
  },
  "/user/login.GET.response.200" : {
    "type" : "string"
  },
  "/user/login.GET.response.400" : { },
  "/user/logout.GET.response.default" : { },
  "/user/{username}.DELETE.request.path" : {
    "type" : "object",
    "properties" : {
      "username" : {
        "type" : "string",
        "title" : "username"
      }
    }
  },
  "/user/{username}.DELETE.response.400" : { },
  "/user/{username}.DELETE.response.404" : { },
  "/user/{username}.GET.request.path" : {
    "type" : "object",
    "properties" : {
      "username" : {
        "type" : "string",
        "title" : "username"
      }
    }
  },
  "/user/{username}.GET.response.200" : {
    "type" : "object",
    "properties" : {
      "firstName" : {
        "type" : "string"
      },
      "lastName" : {
        "type" : "string"
      },
      "password" : {
        "type" : "string"
      },
      "userStatus" : {
        "type" : "integer",
        "format" : "int32"
      },
      "phone" : {
        "type" : "string"
      },
      "id" : {
        "type" : "integer",
        "format" : "int64"
      },
      "email" : {
        "type" : "string"
      },
      "username" : {
        "type" : "string"
      }
    }
  },
  "/user/{username}.GET.response.400" : { },
  "/user/{username}.GET.response.404" : { },
  "/user/{username}.PUT.request.body" : {
    "type" : "object",
    "properties" : {
      "body" : {
        "type" : "object",
        "properties" : {
          "firstName" : {
            "type" : "string"
          },
          "lastName" : {
            "type" : "string"
          },
          "password" : {
            "type" : "string"
          },
          "userStatus" : {
            "type" : "integer",
            "format" : "int32"
          },
          "phone" : {
            "type" : "string"
          },
          "id" : {
            "type" : "integer",
            "format" : "int64"
          },
          "email" : {
            "type" : "string"
          },
          "username" : {
            "type" : "string"
          }
        }
      }
    }
  },
  "/user/{username}.PUT.request.path" : {
    "type" : "object",
    "properties" : {
      "username" : {
        "type" : "string",
        "title" : "username"
      }
    }
  },
  "/user/{username}.PUT.response.400" : { },
  "/user/{username}.PUT.response.404" : { }
}