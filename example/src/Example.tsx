import { createEffect, For } from 'solid-js'
import { RabitzUI, recordings, recordingInfo } from "rabitz";
import { Dynamic } from 'solid-js/web';
import "rabitz/index.css";

export default function example() {

    createEffect(() =>{
        console.log("recordingInfo", recordingInfo())
    })

    createEffect(() =>{
        console.log("recordings", recordings())
    })

    return (
        <>
            <div class="flex items-center justify-center w-full p-0 md:p-4">
                <div class="items-center justify-center w-full md:w-200 lg:w-250 m-auto">
                    <RabitzUI bands={512} maxRecordingTime={120} visualizerStyle='spectrum' />
                </div>
            </div>
            <div class="flex flex-wrap gap-1.25 items-end w-[70vw] mx-auto">
                <For each={recordings()}>
                    {(recording) => {return (
                       <div class="flex flex-col gap-[3px] flex-[0_0_calc(33%-5px)] max-w-[33%] pb-2.5">
                            <Dynamic component={recording.mimeType.startsWith("audio") ? "audio" : "video"} controls src={recording.url} class="max-h-80" />
                            <a 
                                href={recording.url} 
                                download={`rabitz-${recording.mimeType.startsWith("video") ? "video" : "audio"}-recording_${new Date().toISOString().slice(0,10)}_${new Date().toTimeString().slice(0,8).replace(/:/g,"")}.webm`} class="w-full bg-gray-300 block text-center">Download</a>
                        </div>
                    );}}
                </For>
            </div>
        </>
    );
}
