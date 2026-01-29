using MPL.Server;
using MPL.Shared.Messages;
using MPL.Shared.Models;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using System.Collections.Concurrent;

internal class Program
{
    private const int Port = 5000;
    private const int LobbyWidth = 20;
    private const int LobbyHeight = 10;

    private static int _nextPlayerId = 1;
    private static readonly Broadcaster Broadcaster = new(TimeSpan.FromMilliseconds(200));

    static async Task Main()
    {
        Broadcaster.Start();

        TcpListener listener = new(IPAddress.Any, Port);
        listener.Start();
        Console.WriteLine($"[SERVER] Käynnissä portissa {Port}");

        while (true)
        {
            var client = await listener.AcceptTcpClientAsync().ConfigureAwait(false);
            _ = HandleClientAsync(client);
        }
    }

    private static async Task HandleClientAsync(TcpClient client)
    {
        int playerId = Interlocked.Increment(ref _nextPlayerId) - 1;
        var player = new Player 
        { 
            Id = playerId, 
            Avatar = '@'
        };
        Broadcaster.Players[playerId] = player;

        try
        {
            using NetworkStream stream = client.GetStream();
            using StreamReader reader = new(stream, Encoding.UTF8);
            using StreamWriter writer = new(stream, Encoding.UTF8) { AutoFlush = true };

            var connection = new ClientConnection(playerId, client, writer);
            Broadcaster.AddClient(connection);

            // Send WelcomeMessage
            var welcome = new WelcomeMessage { PlayerId = playerId };
            await connection.WriteLineAsync(JsonSerializer.Serialize(welcome)).ConfigureAwait(false);

            Console.WriteLine($"[SERVER] Pelaaja {playerId} liittyi lobbyyn");

            // Read loop
            while (true)
            {
                string? line = await reader.ReadLineAsync().ConfigureAwait(false);
                if (line == null) break;

                try
                {
                    using var doc = JsonDocument.Parse(line);
                    if (doc.RootElement.TryGetProperty("Direction", out var _))
                    {
                        var move = JsonSerializer.Deserialize<MoveMessage>(line);
                        if (move != null && Broadcaster.Players.TryGetValue(playerId, out var pl))
                        {
                            ApplyMove(pl, move.Direction);
                        }
                    }
                    else if (doc.RootElement.TryGetProperty("Message", out var _))
                    {
                        var chat = JsonSerializer.Deserialize<ChatMessage>(line);
                        if (chat != null && Broadcaster.Players.TryGetValue(playerId, out var pl)) 
                        {
                            chat.PlayerId = playerId;

                            // AVATAR
                            if(chat.Message.StartsWith("/avatar ")) 
                            {
                                HandleAvatarCommand(pl, chat.Message);
                            }
                            // COLOR
                            else if (chat.Message.StartsWith("/color "))
                            {
                                HandleColorCommand(pl, chat.Message);
                            }
                            // NAME
                            else if (chat.Message.StartsWith("/name "))
                            {
                                HandleNameCommand(pl, chat.Message);
                            }
                            // NORMAL CHAT
                            else
                            {
                                Broadcaster.EnqueueChat(chat);
                            }
                        }
                    }
                }
                catch (JsonException)
                {
                    // malformed incoming message; ignore or log
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[ERROR] Pelaaja {playerId}: {ex.Message}");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERROR] Pelaaja {playerId}: {ex.Message}");
        }
        finally
        {
            Broadcaster.Players.TryRemove(playerId, out _);
            Broadcaster.RemoveClient(playerId);
            Console.WriteLine($"[SERVER] Pelaaja {playerId} poistui lobbysta");
        }
    }

    private static void ApplyMove(Player player, string direction)
    {
        switch (direction?.ToLowerInvariant())
        {
            case "w": player.Y = Math.Max(0, player.Y - 1); break;
            case "s": player.Y = Math.Min(LobbyHeight - 1, player.Y + 1); break;
            case "a": player.X = Math.Max(0, player.X - 1); break;
            case "d": player.X = Math.Min(LobbyWidth - 1, player.X + 1); break;
        }
    }

    private static void HandleAvatarCommand(Player player, string message) 
    {
        char avatar = message.Last();

        if (char.IsControl(avatar))
            return;

        player.Avatar = avatar;
    }

    private static void HandleColorCommand(Player player, string message) 
    {
        string colorName = message.Substring(7).Trim();

        if (Enum.TryParse<ConsoleColor>(colorName, true, out var color)) 
        {
            player.AvatarColor = color;
        }
    }

    private static void HandleNameCommand(Player player, string message) 
    {
        string playerName = message.Substring(6).Trim();

        if (string.IsNullOrWhiteSpace(playerName))
            return;

        var oldName = player.Name;
        player.Name = playerName;

        var announce = new ChatMessage
        {
            PlayerId = player.Id,
            Message = $"renamed from {oldName} to {playerName}"
        };
        Broadcaster.EnqueueChat(announce);
    }
}
