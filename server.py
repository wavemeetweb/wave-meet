import os
import uuid
import json
from aiohttp import web
from aiortc import RTCPeerConnection, RTCSessionDescription

pcs = set()

routes = web.RouteTableDef()

@routes.get("/")
async def index(request):
    return web.FileResponse("./static/client.html")

@routes.post("/offer")
async def offer(request):
    params = await request.json()
    offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])

    pc = RTCPeerConnection()
    pcs.add(pc)

    @pc.on("iceconnectionstatechange")
    async def on_iceconnectionstatechange():
        if pc.iceConnectionState == "failed":
            await pc.close()
            pcs.discard(pc)

    await pc.setRemoteDescription(offer)
    await pc.setLocalDescription(await pc.createAnswer())

    return web.json_response({
        "sdp": pc.localDescription.sdp,
        "type": pc.localDescription.type
    })

app = web.Application()
app.add_routes(routes)
app.router.add_static('/', path="./static", name='static')

web.run_app(app, port=8080)
