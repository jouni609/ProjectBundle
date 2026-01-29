using System.Collections.Generic;
using MPL.Shared.Models;

namespace MPL.Shared.Messages
{
    public class WelcomeMessage
    {
        public int PlayerId { get; set; }
    }

    public class ChatMessage 
    {
        public int PlayerId { get; set;}
        public string Message { get; set; } = "";
    }

    public class MoveMessage 
    {
        public string Direction { get; set; } = "";
    }

    public class GameStateMessage
    {
        public List<Player> Players { get; set; } = new();
    }

    public class LobbyStateMessage
    {
        public List<Player> Players { get; set; } = new();
        public List<ChatMessage> ChatHistory { get; set; } = new();
    }
}
