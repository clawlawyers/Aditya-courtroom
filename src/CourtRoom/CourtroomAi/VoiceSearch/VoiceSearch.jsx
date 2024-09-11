import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const VoiceSearch = ({ setVoiceSearchInitiate, setAddArgumentInputText }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [transcriptText, setTranscriptText] = useState("");

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="bg-slate-100 rounded py-2 px-3 text-black w-1/3 flex flex-col gap-3 justify-center items-center">
      <div className="w-full flex justify-end">
        <svg
          onClick={() => setVoiceSearchInitiate(false)}
          className="w-7 cursor-pointer"
          fill="black"
          clip-rule="evenodd"
          fill-rule="evenodd"
          stroke-linejoin="round"
          stroke-miterlimit="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
        </svg>
      </div>
      <div>
        {listening ? (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 20l-5 4h10l-5-4zm4-9c0 2.209-1.791 4-4 4s-4-1.791-4-4v-7c0-2.209 1.791-4 4-4s4 1.791 4 4v7zm4-2v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2z" />
            </svg>
            <p>On</p>
          </div>
        ) : (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 20l-5 4h10l-5-4zm0-18c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2m0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2z" />
            </svg>
            <p>Off</p>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="bg-black text-white rounded px-3 py-1"
          onClick={SpeechRecognition.startListening}
        >
          Start
        </button>
        <button
          className="bg-black text-white rounded px-3 py-1"
          onClick={SpeechRecognition.stopListening}
        >
          Stop
        </button>
        <button
          className="bg-black text-white rounded px-3 py-1"
          onClick={resetTranscript}
        >
          Reset
        </button>
      </div>

      {/* <p>{transcript}</p> */}
      <textarea
        readOnly
        className="py-2 px-3 w-full h-28 border border-black rounded"
        value={transcript}
        onChange={(e) => setTranscriptText(e.target.value)}
      />
      <button
        onClick={() => {
          setAddArgumentInputText(transcript);
          setVoiceSearchInitiate(false);
        }}
        className="bg-black text-white rounded px-2 py-1"
      >
        Add To Argument
      </button>
    </div>
  );
};

export default VoiceSearch;
