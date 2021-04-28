# fancy-todo
membuat sebuah website for managing fancy things todo

This App has:
- RESTful endpoint for Todo's CRUD operation
- JSON formatted response

## RESTful endpoints


-----
# POST /register

Request Header
Not needed

Request Body
```
  {
    "email": "<email input>",
    "password": "<password input>"
  }
```

Response(201-ok)
```
  {
    "id": <auto generate by database>,
    "email": "<email resgistered>",
  }
```

Response(400-Bad Request)
```
{
  "message": "Validation Error"
}
```




# POST /login

Request Header
Not Needed

Request Body
```
  {
    "email": "<email input>",
    "password": "<password input>"
  }
```

Response(200-ok)
```
  {
    "id": <user id>,
    "email": "<user email>",
    "access_token": "<user access token>"
  }
```

Response(401-Unauthorized)
```
{
  "message": "Invalid Email or Password"
}
```




# POST /loginGoogle

Request Header
Not Needed

Request Body
```
{
  "googleToken": "<googleToken>"
}
```

Response(200-ok)
```
  {
    "id": <user id>,
    "email": "<user email>",
    "access_token": "<user access token>"
  }
```




# GET /todos

Request Header
```
{
  "access_token": "<your access token>"
}
```

Request Body
Not Needed

Response(200-ok)
```
[
  {
    "id": 1,
    "title": "<todos title>",
    "description": "<todos description>",
    "status" : "<todos status>",
    "due_date" : "<posted due_date>",
    "createdAt": "2020-03-20T07:15:12.149Z",
    "updatedAt": "2020-03-20T07:15:12.149Z",
  },
  {
    "id": 2,
    "title": "<todos title>",
    "description": "<todos description>",
    "status" : "<todos status>",
    "due_date" : "<posted due_date>",
    "createdAt": "2020-03-20T07:15:12.149Z",
    "updatedAt": "2020-03-20T07:15:12.149Z",
  }
]
```

Response(400-Bad Request)
```
{
  "message": "Validation Error"
}
```

Response(500-Internal Server Error)
```
{
  "message": "Internal Server Error"
}
```



-----
# POST /todos

Request Header
```
{
  "access_token": "<your access token>"
}
```

Request Body
```
{
    "title": "<title to get insert to>",
    "description": "<description to get insert to>",
    "status" : "<status to get insert to>",
    "due_date" : "<due_date to get insert to>",
}
```

Response(201-created)
```
{
    "id": <given id by system>,
    "title": "<posted title>",
    "description": "<posted description>",
    "status" : "<posted status>",
    "due_date" : "<posted due_date>",
    "createdAt": "<given id by system>",
    "updatedAt": "<given id by system>",
},
{
    base_currency: "USD"
    rate_IDR: "<IDR rate at time updated>"
    time_updated: "<updated time from API>"
}
```

Response(400-Bad Request)
```
{
  "message": "Validation Error"
}
```

Response(500-Internal Server Error)
```
{
  "message": "Internal Server Error"
}
```



-----
# GET /todos/:id

Request Header
```
{
  "access_token": "<your access token>"
}
```

Request Body
Not Needed

Request Params
```
id = <id requested>
```

Response(200-ok)
```
  {
    "id": <id as request>,
    "title": "<todos title>",
    "description": "<todos description>",
    "status" : "<todos status>",
    "due_date" : "<todos due_date>",
    "createdAt": "<todos createdAt>",
    "updatedAt": "<todos updatedAt>",
  }
  ```

Response(404-Error Not Found)
```
{
  "message": "Error Not Found"
}
```




-----
# PUT /todos/:id

Request Header
```
{
  "access_token": "<your access token>"
}
```

Request Body
```
{
    "title": "<title to get updated to>",
    "description": "<description to get updated to>",
    "status" : "<status to get updated to>",
    "due_date" : ""<due_date to get updated to>"",
}
```

Request Params
```
id = <id to be requested>
```

Response(200-ok)
```
  {
    "id": <id as request>,
    "title": "<todos title>",
    "description": "<todos description>",
    "status" : "<todos status>",
    "due_date" : "2020-03-24T07:15:12.149Z",
    "createdAt": "2020-03-20T07:15:12.149Z",
    "updatedAt": "2020-03-20T07:15:12.149Z",
  }
```

Response(400-Bad Request)
```
{
  "message": "Validation Error"
}
```

Response(404-Error Not Found)
```
{
  "message": "Error Not Found"
}
```

Response(500-Internal Server Error)
```
{
  "message": "Internal Server Error"
}
```




-----
# PATCH /todos/:id

Request Header
```
{
  "access_token": "<your access token>"
}
```

Request Body
```
{
    "status" : "<status to be requested>"
}
```

Request Params
```
id = <id to be requested>
```

Response(200-ok)
```
  {
    "id": <todos id>,
    "title": "<todos title>",
    "description": "<todos description>",
    "status" : "<status to get updated to>",
    "due_date" : "<todos due_date>",
    "createdAt": "<todos createdAt>",
    "updatedAt": "<todos updatedAt>",
  }
  ```

Response(400-Bad Request)
```
{
  "message": "Validation Error"
}
```

Response(404-Error Not Found)
```{
  "message": "Error Not Found"
}
```

Response(500-Internal Server Error)
```
{
  "message": "Internal Server Error"
}
```




-----
# DELETE /todos/:id

Request Header
```
{
  "access_token": "<your access token>"
}
```

Request Params
```
id = <id to be requested>
```

Response(200-ok)
```
  {
    "message": "todo success to delete"
  }
  ```

Response(404-Error Not Found)
```
{
  "message": "Error Not Found"
}
```

Response(500-Internal Server Error)
```
{
  "message": "Internal Server Error"
}
```

