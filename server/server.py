from sanic import Sanic
from sanic.response import text, html, json, file, stream, HTTPResponse, StreamingHTTPResponse
from sanic.request import Request
from sanic_jwt import initialize


from backend.routes.userRoute.UserRoute import user_route, authenticate, retrieve_user
app = Sanic("DeepLearnApp")


@app.get("/")
async def hello_world(request: Request) -> HTTPResponse:
    return text('Hello World')

initialize(app,
           authenticate=authenticate,
           retrieve_user=retrieve_user,
           url_prefix='/v1/api/auth')
