import { useState } from 'react';

export function useCopy() {
  const [copiedId, setCopiedId] = useState(null);

  const copy = (text, id = 'default', message = 'Success แล้วจ้า') => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: message }));
    setTimeout(() => setCopiedId(null), 2000);
  };

  return { copiedId, copy };
}
