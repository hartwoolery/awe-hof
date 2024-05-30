import { Count, LensSource, LensLaunchData, PartialContainer, bootstrapCameraKit, createMediaStreamSource } from '@snap/camera-kit'
import { Push2Web } from "@snap/push2web";
import { Subject } from 'rxjs';

declare global {
  interface Window {
    onLogin: any;
  }
}

const liveRenderTarget = document.getElementById('canvas1') as HTMLCanvasElement;
const logger = document.getElementById("logger") as HTMLCanvasElement;
const loading = document.getElementById("container") as HTMLCanvasElement;

function setDebug(text:string) {
  logger.innerHTML = text
   
}

(async function () {
  const push2Web = new Push2Web();
  var subscribed = false
  window.onLogin = function(loginToken : string){
    if (subscribed) return;
    setDebug("Logged In")
    console.log(loginToken)
    localStorage.setItem("access_token", loginToken)

    push2Web.subscribe(loginToken, session, cameraKit.lensRepository);

    subscribed = true
  }

  push2Web.events.addEventListener("lensReceived", console.log);
  push2Web.events.addEventListener("error", function(err:any) {
    console.log(err.detail)
    localStorage.removeItem("access_token")
    setDebug("Logged Out")
  });
  push2Web.events.addEventListener("subscriptionChanged", console.log);

  const extensions = (container: { provides: (arg0: PartialContainer<{ lensSources: LensSource[]; externalMetricsSubject: Subject<Count>; }, {}>) => any; }) => container.provides(push2Web.extension);

  var config : any = {
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzEzODEwMjI2LCJzdWIiOiJlMGRkMGUxYy0xMTkyLTRlZjctODAwNi00YmExNmE0NTY2ZTV-UFJPRFVDVElPTn45ODI3ODhmMy0yYWNlLTQ5YWUtODkzMi0yYzYwZDU1NmNkMDYifQ.H8FhJ0mOHmbmB0CqgOhyxuQM5Lp4Md5BfbjS_B9DpcE'
  }

  config.lensCoreOverrideUrls = {
    wasm: 'https://snap-ck-ms-teams.s3.amazonaws.com/lc/LensCoreWebAssembly.wasm',
    js: 'https://snap-ck-ms-teams.s3.amazonaws.com/lc/LensCoreWebAssembly.js',
  }

  const cameraKit = await bootstrapCameraKit(config, extensions);

  const session = await cameraKit.createSession({ liveRenderTarget });
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "environment"  // This attempts to select the rear-facing camera
    }
  });


  
  const source = createMediaStreamSource(stream, { fpsLimit: 30 });


  await session.setSource(source);
  

  await session.play();

  let usePush = window.location.hostname == "awe.ngrok.app";
  
  if (usePush) {
    

    const searchParams = new URLSearchParams(window.location.search);
    let token = searchParams.get('access_token') || localStorage.getItem("access_token"); 
    if (token) {
      window.onLogin(token)
    } 

    
    
  } else {
    var lens = await cameraKit.lensRepository.loadLens(
      '268dd9cd-5211-4658-8008-ab2db3762f46',
      '6f0b1073-8317-460d-945e-9a389d66ca91'
    );
  
    lens.cameraFacingPreference = 2; //back camera
    
    await session.applyLens(lens, {launchParams:{"isWeb":"true"}});

    //let live = session.output.live;
    //let ratio = live.width/live.height;
  }

  let onResize = async function() {
    let wWindow = document.documentElement.clientWidth
    let h = document.documentElement.clientHeight
    //let w = h * ratio
    //liveRenderTarget.style.position = "absolute"
    liveRenderTarget.style.width = "100%"//w + "px";
    liveRenderTarget.style.height = h + "px";
    //liveRenderTarget.style.left = (wWindow - w) * 0.5 + "px"
    await source.setRenderSize(wWindow, h);
  }


  if (!usePush) {
    window.addEventListener('resize', onResize, true);
    onResize()
    loading.style.display = 'none'
    liveRenderTarget.style.display = 'block'
  }
  

  //console.log(liveRenderTarget.width , liveRenderTarget.height)
  //await source.setRenderSize(liveRenderTarget.width , liveRenderTarget.height);
  //console.log(window.innerWidth * ratio, window.innerHeight)
})()



