namespace CriePlaylist.Models;

public class Musica
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Artista { get; set; }
    public ICollection<PlaylistMusica> PlaylistMusicas { get; set; }
}
