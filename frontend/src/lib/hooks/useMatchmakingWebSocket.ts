import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface MatchFoundData {
  match_id: number;
  problem: {
    id: number;
    title: string;
    slug: string;
    difficulty: string;
    tags: string[];
    acceptance_rate: string;
  };
  opponent: {
    username: string;
    elo: number;
  };
}

interface WebSocketMessage {
  type: string;
  match_id?: number;
  problem?: any;
  opponent?: any;
  result?: string;
  elo_change?: string;
  message?: string;
}

export const useMatchmakingWebSocket = (userId: number | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInQueue, setIsInQueue] = useState(false);
  const [matchData, setMatchData] = useState<MatchFoundData | null>(null);
  const [matchFound, setMatchFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();

  const connect = useCallback(() => {
    if (!userId || wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`ws://127.0.0.1:8000/matchmaking/ws/matchmaking/${userId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log('📨 Received:', message);

        switch (message.type) {
          case 'queue_joined':
            setIsInQueue(true);
            break;

          case 'queue_left':
            setIsInQueue(false);
            break;

          case 'match_found':
            console.log('🎉 Match found!', message);
            setIsInQueue(false);
            setMatchData({
              match_id: message.match_id!,
              problem: message.problem,
              opponent: message.opponent!
            });
            setMatchFound(true);
            break;

          case 'match_completed':
            console.log('🏁 Match completed:', message.result);
            setMatchFound(false);
            setMatchData(null);
            
            // Redirect to results page after short delay
            setTimeout(() => {
              router.push(`/match-result/${message.match_id}`);
            }, 2000);
            break;

          case 'error':
            setError(message.message || 'Unknown error');
            break;

          case 'pong':
            // Heartbeat response
            break;

          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = (event) => {
      console.log('🔌 WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      setIsInQueue(false);
      
      // Attempt to reconnect after delay (unless intentionally closed)
      if (event.code !== 1000 && userId) {
        setTimeout(() => {
          connect();
        }, 3000);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setError('Connection error');
    };

  }, [userId, router]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsInQueue(false);
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  }, []);

  const joinQueue = useCallback(() => {
    sendMessage({ type: 'join_queue' });
  }, [sendMessage]);

  const leaveQueue = useCallback(() => {
    sendMessage({ type: 'leave_queue' });
  }, [sendMessage]);

  const submitSolution = useCallback((matchId: number) => {
    sendMessage({ 
      type: 'submit_solution', 
      match_id: matchId 
    });
  }, [sendMessage]);

  const resignMatch = useCallback((matchId: number) => {
    sendMessage({ 
      type: 'resign_match', 
      match_id: matchId 
    });
  }, [sendMessage]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    if (userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect]);

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      sendMessage({ type: 'ping' });
    }, 30000); // Ping every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected, sendMessage]);

  return {
    isConnected,
    isInQueue,
    matchFound,
    matchData,
    error,
    joinQueue,
    leaveQueue,
    submitSolution,
    resignMatch,
    connect,
    disconnect
  };
};