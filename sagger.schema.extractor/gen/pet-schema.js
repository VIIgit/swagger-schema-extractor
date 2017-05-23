var schemas = {
  "/pet.POST.request.param" : {
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
            "type" : "string"
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
  "/pet.POST.response.405" : { },
  "/pet.PUT.request.param" : {
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
            "type" : "string"
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
  "/pet.PUT.response.400" : { },
  "/pet.PUT.response.404" : { },
  "/pet.PUT.response.405" : { },
  "/pet/findByStatus.GET.request.param" : {
    "title" : "status",
    "properties" : {
      "status" : {
        "in" : "query",
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
  "/pet/findByStatus.GET.response.400" : { },
  "/pet/findByTags.GET.request.param" : {
    "title" : "tags",
    "properties" : {
      "tags" : {
        "in" : "query",
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
  "/pet/findByTags.GET.response.400" : { },
  "/pet/{petId}.DELETE.request.param" : {
    "title" : "petId",
    "properties" : {
      "petId" : {
        "in" : "path",
        "type" : "integer",
        "title" : "petId"
      },
      "api_key" : {
        "in" : "header",
        "type" : "string",
        "title" : "api_key"
      }
    }
  },
  "/pet/{petId}.DELETE.response.400" : { },
  "/pet/{petId}.DELETE.response.404" : { },
  "/pet/{petId}.GET.request.param" : {
    "title" : "petId",
    "properties" : {
      "petId" : {
        "in" : "path",
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
  },
  "/pet/{petId}.GET.response.400" : { },
  "/pet/{petId}.GET.response.404" : { },
  "/pet/{petId}.POST.request.param" : {
    "title" : "status",
    "properties" : {
      "petId" : {
        "in" : "path",
        "type" : "integer",
        "title" : "petId"
      },
      "name" : {
        "in" : "formData",
        "type" : "string",
        "title" : "name"
      },
      "status" : {
        "in" : "formData",
        "type" : "string",
        "title" : "status"
      }
    }
  },
  "/pet/{petId}.POST.response.405" : { },
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
  },
  "/store/order.POST.request.param" : {
    "type" : "object",
    "title" : "body",
    "properties" : {
      "body" : {
        "type" : "object",
        "properties" : {
          "petId" : {
            "type" : "integer"
          },
          "quantity" : {
            "type" : "integer"
          },
          "id" : {
            "type" : "integer"
          },
          "shipDate" : {
            "type" : "string"
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
        "type" : "integer"
      },
      "quantity" : {
        "type" : "integer"
      },
      "id" : {
        "type" : "integer"
      },
      "shipDate" : {
        "type" : "string"
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
  "/store/order/{orderId}.DELETE.request.param" : {
    "title" : "orderId",
    "properties" : {
      "orderId" : {
        "in" : "path",
        "type" : "integer",
        "title" : "orderId",
        "minimum" : 1.0
      }
    }
  },
  "/store/order/{orderId}.DELETE.response.400" : { },
  "/store/order/{orderId}.DELETE.response.404" : { },
  "/store/order/{orderId}.GET.request.param" : {
    "title" : "orderId",
    "properties" : {
      "orderId" : {
        "in" : "path",
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
        "type" : "integer"
      },
      "quantity" : {
        "type" : "integer"
      },
      "id" : {
        "type" : "integer"
      },
      "shipDate" : {
        "type" : "string"
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
  "/user.POST.request.param" : {
    "type" : "object",
    "title" : "body",
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
            "type" : "integer"
          },
          "phone" : {
            "type" : "string"
          },
          "id" : {
            "type" : "integer"
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
  "/user/createWithArray.POST.request.param" : {
    "type" : "object",
    "title" : "body",
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
            "type" : "integer"
          },
          "phone" : {
            "type" : "string"
          },
          "id" : {
            "type" : "integer"
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
  "/user/createWithList.POST.request.param" : {
    "type" : "object",
    "title" : "body",
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
            "type" : "integer"
          },
          "phone" : {
            "type" : "string"
          },
          "id" : {
            "type" : "integer"
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
  "/user/login.GET.request.param" : {
    "title" : "password",
    "properties" : {
      "password" : {
        "in" : "query",
        "type" : "string",
        "title" : "password"
      },
      "username" : {
        "in" : "query",
        "type" : "string",
        "title" : "username"
      }
    }
  },
  "/user/login.GET.response.200" : {
    "type" : "string"
  },
  "/user/login.GET.response.400" : { },
  "/user/logout.GET.request.param" : { },
  "/user/logout.GET.response.default" : { },
  "/user/{username}.DELETE.request.param" : {
    "title" : "username",
    "properties" : {
      "username" : {
        "in" : "path",
        "type" : "string",
        "title" : "username"
      }
    }
  },
  "/user/{username}.DELETE.response.400" : { },
  "/user/{username}.DELETE.response.404" : { },
  "/user/{username}.GET.request.param" : {
    "title" : "username",
    "properties" : {
      "username" : {
        "in" : "path",
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
        "type" : "integer"
      },
      "phone" : {
        "type" : "string"
      },
      "id" : {
        "type" : "integer"
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
  "/user/{username}.PUT.request.param" : {
    "type" : "object",
    "title" : "body",
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
            "type" : "integer"
          },
          "phone" : {
            "type" : "string"
          },
          "id" : {
            "type" : "integer"
          },
          "email" : {
            "type" : "string"
          },
          "username" : {
            "type" : "string"
          }
        }
      },
      "username" : {
        "in" : "path",
        "type" : "string",
        "title" : "username"
      }
    }
  },
  "/user/{username}.PUT.response.400" : { },
  "/user/{username}.PUT.response.404" : { }
}