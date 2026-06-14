import { Recorder } from "./Recorder";

function App() {
  return (
    <>
      <div class="w-dvw h-dvh flex justify-center">
        <div class="w-full aspect-9/16 landscape:aspect-video">
          <Recorder />
        </div>
      </div>
    </>
  );
}

export default App;
