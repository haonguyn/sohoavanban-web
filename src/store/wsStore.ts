import { ref } from 'vue';
import { getToken, hasRole } from '../utils/authUtils';

export const unreadDocsCount = ref(0);
let ws: WebSocket | null = null;

export function connectWS() {
  console.log("connectWS() was called");
  if (ws) {
    console.log("WebSocket is already connected.");
    return;
  }

  const token = getToken();
  if (!token) {
    console.log("No token, aborting connectWS");
    return;
  }
  if (!hasRole(['admin'])) {
    console.log("User does not have admin role, aborting connectWS");
    return;
  }

  // Gọi biến môi trường hoặc fallback về localhost
  const wsBaseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
  console.log("Connecting WebSocket to", wsBaseUrl);
  
  ws = new WebSocket(`${wsBaseUrl}/notifications/?token=${token}`);

  ws.onopen = () => {
    console.log('WebSocket connected: Admin Notifications');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'new_document') {
        unreadDocsCount.value++;
        
        // Gọi CustomEvent cho ToastNotification lắng nghe và hiển thị
        window.dispatchEvent(new CustomEvent('global-toast', {
          detail: {
            type: 'info',
            title: data.message || 'Thông báo mới',
            message: data.doc_number ? `Số hiệu: ${data.doc_number}` : (data.title || 'Bạn có một văn bản mới chờ xem'),
            duration: 4000
          }
        }));
      }
    } catch (e) {
      console.error('Error parsing notification', e);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    ws = null;
    // Có thể implements reconnect loop here
  };
}

export function disconnectWS() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

export function resetCount() {
  unreadDocsCount.value = 0;
}
