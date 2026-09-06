import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchHealthStatus, fetchDatabaseHealthStatus } from '../services/api';
import { socket, connectSocket, disconnectSocket } from '../services/socket';
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Server,
  Database,
  Wifi,
  Activity,
  Clock
} from 'lucide-react';

const HealthPage = () => {
  const [backendState, setBackendState] = useState({
    loading: true,
    connected: false,
    message: '',
    timestamp: null,
    error: null
  });

  const [dbState, setDbState] = useState({
    loading: true,
    connected: false,
    message: '',
    error: null
  });

  const [socketStatus, setSocketStatus] = useState('Connecting');
  const [socketId, setSocketId] = useState(null);

  const checkHealth = async () => {
    // 1. Reset loading states
    setBackendState((prev) => ({ ...prev, loading: true, error: null }));
    setDbState((prev) => ({ ...prev, loading: true, error: null }));

    // 2. Fetch Backend API Health
    try {
      const apiData = await fetchHealthStatus();
      if (apiData?.success) {
        setBackendState({
          loading: false,
          connected: true,
          message: apiData.message || 'Engineers’ Day Quiz API is running',
          timestamp: apiData.timestamp,
          error: null
        });
      } else {
        throw new Error(apiData?.message || 'Invalid API response');
      }
    } catch (err) {
      setBackendState({
        loading: false,
        connected: false,
        message: 'Backend unreachable',
        timestamp: null,
        error: err.response?.data?.message || err.message
      });
    }

    // 3. Fetch Database Connection Health
    try {
      const dbData = await fetchDatabaseHealthStatus();
      if (dbData?.success) {
        setDbState({
          loading: false,
          connected: true,
          message: dbData.message || 'Database connection successful',
          error: null
        });
      } else {
        throw new Error(dbData?.message || 'Database check failed');
      }
    } catch (err) {
      setDbState({
        loading: false,
        connected: false,
        message: 'Database unavailable',
        error: err.response?.data?.message || err.message
      });
    }
  };

  useEffect(() => {
    checkHealth();

    // Socket listeners setup
    connectSocket();

    const onConnect = () => {
      setSocketStatus('Ready');
      setSocketId(socket.id);
    };

    const onDisconnect = () => {
      setSocketStatus('Disconnected');
      setSocketId(null);
    };

    const onConnectError = () => {
      setSocketStatus('Error');
      setSocketId(null);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      disconnectSocket();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center my-12">
        {/* Navigation back link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Landing Page</span>
          </Link>
        </div>

        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl font-extrabold tracking-tight">System Health</h1>
            </div>
            <p className="text-slate-400 text-sm">
              Live connection status verification for Backend, Database, and Socket services.
            </p>
          </div>

          <button
            onClick={checkHealth}
            disabled={backendState.loading || dbState.loading}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw
              className={`w-4 h-4 text-cyan-400 ${
                backendState.loading || dbState.loading ? 'animate-spin' : ''
              }`}
            />
            <span>Refresh Diagnostics</span>
          </button>
        </div>

        {/* Health Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Backend */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400">
                    <Server className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg text-slate-200">Backend</span>
                </div>
                {backendState.connected ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-500" />
                )}
              </div>

              <div className="space-y-2 mt-4">
                <div className="text-2xl font-extrabold">
                  {backendState.loading ? (
                    <span className="text-slate-500 text-base font-normal animate-pulse">Checking...</span>
                  ) : backendState.connected ? (
                    <span className="text-emerald-400">✓ Connected</span>
                  ) : (
                    <span className="text-rose-400">Disconnected</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {backendState.message}
                </p>
              </div>
            </div>

            {backendState.timestamp && (
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center space-x-2 text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(backendState.timestamp).toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          {/* Card 2: Database */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg text-slate-200">Database</span>
                </div>
                {dbState.connected ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-500" />
                )}
              </div>

              <div className="space-y-2 mt-4">
                <div className="text-2xl font-extrabold">
                  {dbState.loading ? (
                    <span className="text-slate-500 text-base font-normal animate-pulse">Checking...</span>
                  ) : dbState.connected ? (
                    <span className="text-emerald-400">✓ Connected</span>
                  ) : (
                    <span className="text-rose-400">Disconnected</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {dbState.message}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
              <span>MySQL 8.0 ORM</span>
            </div>
          </div>

          {/* Card 3: Socket Server */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-purple-400">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg text-slate-200">Socket Server</span>
                </div>
                {socketStatus === 'Ready' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-500" />
                )}
              </div>

              <div className="space-y-2 mt-4">
                <div className="text-2xl font-extrabold">
                  {socketStatus === 'Ready' ? (
                    <span className="text-emerald-400">✓ Ready</span>
                  ) : (
                    <span className="text-amber-400">{socketStatus}</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {socketStatus === 'Ready'
                    ? 'WebSocket connection active'
                    : 'Attempting connection...'}
                </p>
              </div>
            </div>

            {socketId && (
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono truncate">
                <span>ID: {socketId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Diagnostics Console View */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 font-mono text-xs text-slate-300">
          <div className="flex items-center justify-between mb-3 text-slate-400 border-b border-slate-800 pb-2">
            <span>Phase 1 Verification Console</span>
            <span className="text-emerald-400 font-semibold">ALL PHASE 1 CHECKS ACTIVE</span>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400">
              [API Endpoint]: <span className="text-cyan-300">{import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</span>
            </p>
            <p className="text-slate-400">
              [Socket URL]: <span className="text-cyan-300">{import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}</span>
            </p>
            <p className="text-emerald-400 font-medium">✓ React Frontend initialized via Vite</p>
            <p className="text-emerald-400 font-medium">✓ Tailwind CSS design system operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthPage;
