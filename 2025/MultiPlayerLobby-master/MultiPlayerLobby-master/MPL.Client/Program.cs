using MPL.Shared.Messages;
using MPL.Shared.Models;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;

internal class Program
{
    // ===== SERVER =====
    const string ServerIp = "127.0.0.1";
    const int ServerPort = 5000;

    // ===== LAYOUT =====
    const int MapX = 0;
    const int MapY = 0;
    const int MapWidth = 20;
    const int MapHeight = 10;

    const int ChatX = 0;
    const int ChatY = MapY + MapHeight + 1;
    const int ChatWidth = 40;
    const int ChatHeight = 8;

    const int InputX = 0;
    const int InputY = ChatY + ChatHeight + 2;

    // ===== STATE =====
    static LobbyStateMessage? LatestState;
    static string CurrentInput = "";
    static InputMode CurrentMode = InputMode.Move;
    static int MyPlayerId;

    static readonly object StateLock = new();

    // ===== NETWORK =====
    static StreamWriter? Writer;
    static StreamReader? Reader;

    // ===== RENDER BUFFER =====
    struct Cell
    {
        public char Char;
        public ConsoleColor Color;
    }

    static readonly Cell[,] CurrentMap = new Cell[MapWidth, MapHeight];
    static readonly Cell[,] PreviousMap = new Cell[MapWidth, MapHeight];

    enum InputMode { Move, Chat }

    static async Task Main()
    {
        Console.CursorVisible = false;
        Console.Clear();

        TcpClient client = new();
        await client.ConnectAsync(ServerIp, ServerPort);

        NetworkStream stream = client.GetStream();
        Reader = new StreamReader(stream, Encoding.UTF8);
        Writer = new StreamWriter(stream, Encoding.UTF8) { AutoFlush = true };

        var welcome =
            JsonSerializer.Deserialize<WelcomeMessage>(await Reader.ReadLineAsync()!);

        MyPlayerId = welcome!.PlayerId;
        Console.Title = $"MPL Client | Player {MyPlayerId}";

        // ===== RECEIVE LOOP =====
        _ = Task.Run(async () =>
        {
            while (true)
            {
                string? line = await Reader.ReadLineAsync();
                if (line == null) break;

                var state = JsonSerializer.Deserialize<LobbyStateMessage>(line);
                if (state != null)
                {
                    lock (StateLock)
                        LatestState = state;

                    Render();
                }
            }
        });

        // ===== INPUT LOOP =====
        while (true)
        {
            if (!Console.KeyAvailable)
            {
                Thread.Sleep(5);
                continue;
            }

            var key = Console.ReadKey(true);

            lock (StateLock)
            {
                if (CurrentMode == InputMode.Move)
                {
                    switch (key.Key)
                    {
                        case ConsoleKey.W: SendMove("w"); break;
                        case ConsoleKey.A: SendMove("a"); break;
                        case ConsoleKey.S: SendMove("s"); break;
                        case ConsoleKey.D: SendMove("d"); break;
                        case ConsoleKey.Enter:
                            CurrentMode = InputMode.Chat;
                            break;
                    }
                }
                else
                {
                    if (key.Key == ConsoleKey.Enter)
                    {
                        if (!string.IsNullOrEmpty(CurrentInput))
                            SendChat(CurrentInput);

                        CurrentInput = "";
                        CurrentMode = InputMode.Move;
                    }
                    else if (key.Key == ConsoleKey.Backspace)
                    {
                        if (CurrentInput.Length > 0)
                            CurrentInput = CurrentInput[..^1];
                    }
                    else if (!char.IsControl(key.KeyChar))
                    {
                        CurrentInput += key.KeyChar;
                    }
                }
            }

            Render();
        }
    }

    // ===== RENDER =====
    static void Render()
    {
        lock (StateLock)
        {
            if (LatestState == null) return;

            RenderMap(LatestState.Players);
            RenderChat(LatestState.ChatHistory);
            RenderInput();
        }
    }

    // ===== MAP (DIFF RENDER) =====
    static void RenderMap(List<Player> players)
    {
        // fill buffer
        for (int y = 0; y < MapHeight; y++)
            for (int x = 0; x < MapWidth; x++)
                CurrentMap[x, y] = new Cell { Char = '.', Color = ConsoleColor.DarkGray };

        foreach (var p in players)
            CurrentMap[p.X, p.Y] = new Cell
            {
                Char = p.Avatar,
                Color = p.AvatarColor
            };

        // diff draw
        for (int y = 0; y < MapHeight; y++)
        {
            for (int x = 0; x < MapWidth; x++)
            {
                if (!CellsEqual(CurrentMap[x, y], PreviousMap[x, y]))
                {
                    Console.SetCursorPosition(MapX + x, MapY + y);
                    Console.ForegroundColor = CurrentMap[x, y].Color;
                    Console.Write(CurrentMap[x, y].Char);
                    PreviousMap[x, y] = CurrentMap[x, y];
                }
            }
        }

        Console.ResetColor();
    }

    static bool CellsEqual(Cell a, Cell b) =>
        a.Char == b.Char && a.Color == b.Color;

    // ===== CHAT =====
    static void RenderChat(List<ChatMessage> chat)
    {
        int start = Math.Max(0, chat.Count - ChatHeight);

        for (int i = 0; i < ChatHeight; i++)
        {
            Console.SetCursorPosition(ChatX, ChatY + i);

            string line = "";
            ConsoleColor color = ConsoleColor.Gray;

            if (start + i < chat.Count)
            {
                var msg = chat[start + i];
                line = $"{msg.PlayerId}: {msg.Message}";
                if (line.Length > ChatWidth)
                    line = line[..ChatWidth];

                var p = LatestState!.Players.Find(pl => pl.Id == msg.PlayerId);
                if (p != null) color = p.AvatarColor;
            }

            Console.ForegroundColor = color;
            Console.Write(line.PadRight(ChatWidth));
        }

        Console.ResetColor();
    }

    // ===== INPUT =====
    static void RenderInput()
    {
        Console.SetCursorPosition(InputX, InputY);

        Console.ForegroundColor =
            CurrentMode == InputMode.Move ? ConsoleColor.Green : ConsoleColor.Cyan;

        string input = CurrentInput;
        int max = ChatWidth - 2;
        if (input.Length > max)
            input = input[^max..];

        Console.Write("> ");
        Console.Write(input.PadRight(max));

        Console.ResetColor();
    }

    // ===== SEND =====
    static async void SendMove(string dir)
    {
        if (Writer != null)
            await Writer.WriteLineAsync(JsonSerializer.Serialize(
                new MoveMessage { Direction = dir }));
    }

    static async void SendChat(string msg)
    {
        if (Writer != null)
            await Writer.WriteLineAsync(JsonSerializer.Serialize(
                new ChatMessage { Message = msg }));
    }
}

