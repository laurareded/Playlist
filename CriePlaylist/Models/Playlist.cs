namespace CriePlaylist.Models;

public class Playlist
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public ICollection<PlaylistMusica> PlaylistMusicas { get; set; }
}

