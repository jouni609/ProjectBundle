using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using MPL.Shared.Messages;
using MPL.Shared.Models;

namespace MPL.Server
{
    internal sealed class Broadcaster : IDisposable
    {
        private readonly ConcurrentDictionary<int, ClientConnection> _clients = new();
        public ConcurrentDictionary<int, Player> Players { get; } = new();
        public ConcurrentQueue<ChatMessage> ChatHistory { get; } = new();
        private readonly CancellationTokenSource _cts = new();
        private readonly TimeSpan _interval;

        public Broadcaster(TimeSpan interval) => _interval = interval;

        public void Start() => _ = RunAsync(_cts.Token);

        public bool AddClient(ClientConnection connection) => _clients.TryAdd(connection.Id, connection);

        public bool RemoveClient(int id)
        {
            if (_clients.TryRemove(id, out var connection))
            {
                connection.Dispose();
                return true;
            }
            return false;
        }

        public void EnqueueChat(ChatMessage message)
        {
            ChatHistory.Enqueue(message);
            while (ChatHistory.Count > 1000) ChatHistory.TryDequeue(out _);
        }

        private async Task RunAsync(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                try
                {
                    var state = new LobbyStateMessage
                    {
                        Players = Players.Values.ToList(),
                        ChatHistory = ChatHistory.ToArray().TakeLast(10).ToList()
                    };
                    string json = JsonSerializer.Serialize(state);

                    var clients = _clients.Values.ToArray();
                    foreach (var client in clients)
                    {
                        try { await client.WriteLineAsync(json).ConfigureAwait(false); }
                        catch { RemoveClient(client.Id); }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Broadcaster] Error: {ex.Message}");
                }
                try { await Task.Delay(_interval, token).ConfigureAwait(false); }
                catch (TaskCanceledException) { break; }
            }
        }
        public void Dispose() => _cts.Cancel();
    }
}
