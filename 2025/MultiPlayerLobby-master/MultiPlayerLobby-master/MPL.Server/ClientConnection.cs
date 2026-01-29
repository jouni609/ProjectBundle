using System;
using System.IO;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;

namespace MPL.Server
{
    internal sealed class ClientConnection : IDisposable
    {
        private readonly StreamWriter _writer;
        private readonly object _writeLock = new();
        private bool _disposed;

        public int Id { get; }
        public TcpClient TcpClient { get; }
        public CancellationTokenSource Cancellation { get; } = new();

        public ClientConnection(int id, TcpClient tcpClient, StreamWriter writer) 
        {
            Id = id;
            TcpClient = tcpClient ?? throw new ArgumentNullException(nameof(tcpClient));
            _writer = writer ?? throw new ArgumentNullException(nameof(writer));
        }

        public Task WriteLineAsync(string text)
        {
            if (_disposed) return Task.CompletedTask;
            lock (_writeLock)
            {
                return _writer.WriteLineAsync(text);
            }
        }

        public void Dispose() 
        {
            if (_disposed) return;
            _disposed = true;
            try { Cancellation.Cancel(); } catch { }
            try { _writer.Dispose(); } catch { }
            try { TcpClient.Close(); } catch { }
        }
    }
}
