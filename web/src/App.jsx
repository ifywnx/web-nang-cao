import { useEffect, useState } from 'react';
import { getHealth } from './api.js';
import Classify from './features/Classify.jsx';
import Detect from './features/Detect.jsx';
import Search from './features/Search.jsx';
import Chat from './features/Chat.jsx';

const TABS = [
  { id: 'classify', label: 'Phân loại ảnh', model: 'classifier', Component: Classify },
  { id: 'detect', label: 'Phát hiện đối tượng', model: 'detector', Component: Detect },
  { id: 'search', label: 'Tìm kiếm ảnh', model: 'retrieval', Component: Search },
  { id: 'chat', label: 'Chatbot RAG', model: 'llm', Component: Chat },
];

// Khai báo minh bạch các mô hình AI dùng trong bài nộp.
// Tên/phiên bản khớp với notebook và config.py của backend.
const AI_MODELS = [
  ['Phân loại hoa', 'ResNet-18', 'ImageNet-1K V1, fine-tune Flowers (5 lớp)'],
  ['Phát hiện đối tượng', 'YOLO11n', 'Ultralytics YOLO 11 nano, COCO 80 lớp'],
  ['Tìm kiếm ảnh', 'CLIP ViT-B/32', 'openai/clip-vit-base-patch32 + FAISS'],
  ['Chatbot RAG', 'Qwen2.5-Instruct', '0.5B (CPU) / 1.5B (GPU) + multilingual MiniLM-L12-v2 + FAISS'],
];

export default function App() {
  const [tab, setTab] = useState('classify');
  const [health, setHealth] = useState(null);

  useEffect(() => {
    getHealth().then(setHealth).catch(() => setHealth({ status: 'down', models: {} }));
  }, []);

  const current = TABS.find((t) => t.id === tab);
  const ready = health?.models?.[current.model];

  return (
    <div className="app">
      <header>
        <h1>AI Web Apps</h1>
        <p className="muted">
          Backend: {health ? (health.status === 'ok' ? `đang chạy (${health.device})` : 'không kết nối') : 'đang kiểm tra…'}
        </p>
      </header>
      <details className="ai-disclosure">
        <summary>Thông tin AI sử dụng trong bài tập</summary>
        <p className="muted">Các kết quả là suy luận của mô hình AI, chỉ mang tính tham khảo.</p>
        <div className="model-table" role="table" aria-label="Danh sách mô hình AI và phiên bản">
          <div className="model-row model-heading" role="row"><b role="columnheader">Chức năng</b><b role="columnheader">Mô hình / phiên bản</b><b role="columnheader">Cấu hình</b></div>
          {AI_MODELS.map(([feature, model, version]) => (
            <div className="model-row" role="row" key={feature}><span role="cell">{feature}</span><span role="cell">{model}</span><span role="cell">{version}</span></div>
          ))}
        </div>
      </details>
      <nav className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'active' : ''}
                  onClick={() => setTab(t.id)}>
            {t.label}{health && !health.models?.[t.model] ? ' (tắt)' : ''}
          </button>
        ))}
      </nav>
      <main>
        {health && !ready && <p className="error">Mô hình “{current.model}” chưa được nạp ở backend.</p>}
        {(!health || ready) && <current.Component />}
      </main>
    </div>
  );
}
