import { bootstrapCameraKit, createMediaStreamSource } from '@snap/camera-kit'
/*
import { Count, LensSource, PartialContainer, bootstrapCameraKit } from '@snap/camera-kit';
import { Push2Web } from "@snap/push2web";
import { Subject } from 'rxjs';

const push2Web = new Push2Web();

push2Web.events.addEventListener("lensReceived", console.info);
push2Web.events.addEventListener("error", console.error);
push2Web.events.addEventListener("subscriptionChanged", console.info);

const extensions = (container: { provides: (arg0: PartialContainer<{ lensSources: LensSource[]; externalMetricsSubject: Subject<Count>; }, {}>) => any; }) => container.provides(push2Web.extension);

const cameraKit = await bootstrapCameraKit({ apiToken: "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzEzODEwMjI2LCJzdWIiOiJlMGRkMGUxYy0xMTkyLTRlZjctODAwNi00YmExNmE0NTY2ZTV-U1RBR0lOR34wZGIxMjQ1ZC1mODU1LTQ0ZmItOGY5ZS03NGJkMjg0ZmQyYzAifQ.OSyXHIw-VFwTkiyebO93KHhOCb7JRSlTiEXn_FU0FTE" }, extensions);
const cameraKitSession = await cameraKit.createSession();

push2Web.subscribe("login kit access token", cameraKitSession, cameraKit.lensRepository);
*/

(async function () {
  const cameraKit = await bootstrapCameraKit({
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzEzODEwMjI2LCJzdWIiOiJlMGRkMGUxYy0xMTkyLTRlZjctODAwNi00YmExNmE0NTY2ZTV-U1RBR0lOR34wZGIxMjQ1ZC1mODU1LTQ0ZmItOGY5ZS03NGJkMjg0ZmQyYzAifQ.OSyXHIw-VFwTkiyebO93KHhOCb7JRSlTiEXn_FU0FTE',
  });
  const liveRenderTarget = document.getElementById(
    'canvas'
  ) as HTMLCanvasElement;
  const session = await cameraKit.createSession({ liveRenderTarget });
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "environment"  // This attempts to select the rear-facing camera
    }
  });

  //, width:  

  const source = createMediaStreamSource(stream, { fpsLimit: 60 });

  await session.setSource(source);
  await source.setRenderSize(window.innerWidth, window.innerHeight);

  await session.play();

  var lens = await cameraKit.lensRepository.loadLens(
    '268dd9cd-5211-4658-8008-ab2db3762f46',
    '6f0b1073-8317-460d-945e-9a389d66ca91'
  );

  lens.cameraFacingPreference = 2; //back camera

  await session.applyLens(lens);
})();

