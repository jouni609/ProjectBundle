using System;
using System.Collections.Generic;
using System.Text;

namespace MPL.Shared.Models
{

    public enum PlayerStatus 
    {
        InLobby,
        OnPlatform,
        InGame
    }
    public class Player
    {
        public int Id { get; set; }
        public int X { get; set; } = 0;
        public int Y { get; set; } = 0;
        public PlayerStatus Status { get; set; } = PlayerStatus.InLobby;

        public string Name { get; set; } = "Player";

        public char Avatar { get; set; } = '@';

        public ConsoleColor AvatarColor { get; set; } = ConsoleColor.White;
    }
}
//TODO Pelaajan nimi, valmiustila. 