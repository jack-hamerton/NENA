
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useEffect, useState, useMemo } from 'react';
import { getDocument } from '../../services/collaborationService'; // Updated import
import './Document.css';

// --- Helper to get a random color for the user's cursor ---
const getRandomColor = () => {
  const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const Document = ({ document }) => {
  const [userName, setUserName] = useState('Anonymous');
  const [userColor] = useState(getRandomColor);
  const [status, setStatus] = useState('connecting'); // connecting, connected, disconnected

  // --- Set up the Y.js document and WebSocket provider ---
  const { ydoc, provider } = useMemo(() => {
    const newYDoc = new Y.Doc();
    // Connect to the backend WebSocket server
    const newProvider = new WebsocketProvider(
      'ws://localhost:8765',
      document.id, // The document ID is used as the room name
      newYDoc
    );
    return { ydoc: newYDoc, provider: newProvider };
  }, [document.id]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Y.js handles history
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: userName,
          color: userColor,
        },
      }),
    ],
  });

  useEffect(() => {
    // --- User authentication ---
    const name = window.prompt('Enter your name'); // Simple prompt for demonstration
    if (name) {
      setUserName(name);
    }

    // --- Handle WebSocket connection status ---
    provider.on('status', ({ status }) => {
      setStatus(status);
    });
    
    // --- Load the document from the backend ---
    // Note: y-websocket automatically fetches the latest document state upon connection,
    // so manual loading via the REST API is not required for the initial setup.
    // The backend server will load from the database if the document is not in memory.

    return () => {
      provider.destroy();
    };
  }, [provider, document.id]);

  if (!editor) {
    return <p>Loading editor...</p>;
  }

  return (
    <div className="editor">
        <div className="user-management">
            <span>Editing as: <strong>{userName}</strong></span>
            <span style={{ marginLeft: 'auto', color: status === 'connected' ? '#4CAF50' : '#F44336' }}>
                {status}
            </span>
        </div>
        <div className="editor-header">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>B</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>I</button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>S</button>
          <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>P</button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>H1</button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>List</button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>1.</button>
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>""</button>
          {/* The save button is removed because the backend now handles persistence automatically */}
        </div>
        <EditorContent editor={editor} />
    </div>
  );
};
