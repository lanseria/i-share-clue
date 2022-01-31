# coding=utf-8
import imp
from sanic import Sanic
from sanic.response import text, html, json, file, stream, HTTPResponse, StreamingHTTPResponse
from sanic.request import Request
import jieba
import paddle
import jieba.posseg as pseg
from split import split_string
app = Sanic("jieba")

@app.listener("before_server_start")
async def setup_deep_learn(app, loop):
    paddle.enable_static()
    jieba.enable_paddle()  # 启动 paddle 模式。0.40版之后开始支持，早期版本不支持


@app.get("/")
async def hello_world(request: Request) -> HTTPResponse:
    return text('Hello Jieba')

@app.post('/split')
async def split(request: Request) -> HTTPResponse:
    test_sent = str(request.body, 'utf-8')
    split_arr = split_string(test_sent)
    return json(split_arr)