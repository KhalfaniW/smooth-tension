import React, {useState, useRef} from "react";
import JoditEditor from "jodit-react";

import draftToMarkdown from "draftjs-to-markdown";
import {convertToRaw} from "draft-js";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {EditorState} from "draft-js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import showdown from "showdown";

function getMarkdownFromHtml(html) {
  const converter = new showdown.Converter();

  return converter.makeMarkdown(html);
}

export default function MainEditor({}) {
  const [value, setValue] = useState("");
  const modules = {
    toolbar: [
      [{header: [1, 2, 3]}],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{list: "ordered"}, {list: "bullet"}, {indent: "+1"}, {indent: "-1"}],
      ["link", "image"],
      ["clean"],
    ],
  };

  const markdownText = getMarkdownFromHtml(value);
  return (
    <>
      <ReactQuill
        modules={modules}
        theme="snow"
        value={value}
        onChange={setValue}
      />
      {/* <p style={{"white-space": "pre"}}>*/}
      <pre
        style={{
          textAlign: "left",
          whiteSpace: "pre-line",
        }}
      >
        <br /> <br />
        {markdownText}
        <br /> <br />
      </pre>

      <button
        onClick={() => {
          alert(markdownText);
        }}
      >
        abc
      </button>
    </>
  );
}
