import { useEffect, useRef } from 'react';
import { sanitizeAnnouncementHtml } from './announcementRichText.js';

export function AnnouncementRichTextEditor({ html, text, onChange }) {
  const editorRef = useRef(null);
  useEffect(() => {
    const sanitized = html ? sanitizeAnnouncementHtml(html) : '';
    if (sanitized && editorRef.current.innerHTML !== sanitized) {
      editorRef.current.innerHTML = sanitized;
    } else if (!sanitized && text && editorRef.current.innerText !== text) {
      editorRef.current.innerText = text;
    }
  }, [html, text]);
  const handleInput = () => {
    onChange({
      html: sanitizeAnnouncementHtml(editorRef.current.innerHTML),
      text: editorRef.current.innerText,
    });
  };
  return (
    <div className="overflow-hidden rounded-md border border-solid border-[#dce4ee] bg-white">
      <div
        role="toolbar"
        aria-label="จัดรูปแบบรายละเอียดงาน"
        className="flex flex-wrap gap-2 border-0 border-b border-solid border-[#dce4ee] bg-[#f7f9fb] p-2"
      >
        {[
          ['bold', 'ตัวหนา', <b key="bold">B</b>],
          ['italic', 'ตัวเอียง', <i key="italic">I</i>],
          ['underline', 'ขีดเส้นใต้', <u key="underline">U</u>],
          ['insertUnorderedList', 'รายการหัวข้อ', '• รายการ'],
          ['insertOrderedList', 'รายการลำดับ', '1. รายการ'],
          ['removeFormat', 'ล้างรูปแบบ', 'ล้างรูปแบบ'],
        ].map(([command, label, content]) => (
          <button
            key={command}
            type="button"
            aria-label={label}
            className="rounded px-3 py-2 hover:bg-[#e8e5ff]"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              editorRef.current.focus();
              document.execCommand(command);
              handleInput();
            }}
          >
            {content}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="รายละเอียดงาน"
        aria-multiline="true"
        className="announcement-rich-text min-h-40 p-3 outline-none focus:ring-2 focus:ring-[#5135ff]"
        onInput={handleInput}
        onPaste={(event) => {
          event.preventDefault();
          document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
          handleInput();
        }}
      />
    </div>
  );
}
