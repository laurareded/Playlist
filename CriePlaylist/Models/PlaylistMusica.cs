namespace CriePlaylist.Models;

public class PlaylistMusica
{
    public int PlaylistId { get; set; }
    public Playlist Playlist { get; set; }
    public int MusicaId { get; set; }
    public Musica Musica { get; set; }
}

