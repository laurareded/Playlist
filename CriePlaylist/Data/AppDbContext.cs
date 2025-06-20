using CriePlaylist.Models;
using Microsoft.EntityFrameworkCore;

namespace CriePlaylist.Data;

public class AppDbContext : DbContext
{

    public AppDbContext(DbContextOptions options) : base(options) { }

    public DbSet<Musica> Musicas { get; set; }
    public DbSet<Playlist> Playlists { get; set; }
    public DbSet<PlaylistMusica> PlaylistMusicas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configura a chave composta da tabela de relação
        modelBuilder.Entity<PlaylistMusica>()
            .HasKey(pm => new { pm.PlaylistId, pm.MusicaId });

        // Define o relacionamento Playlist <-> PlaylistMusica
        modelBuilder.Entity<PlaylistMusica>()
            .HasOne(pm => pm.Playlist)
            .WithMany(p => p.PlaylistMusicas)
            .HasForeignKey(pm => pm.PlaylistId);

        // Define o relacionamento Musica <-> PlaylistMusica
        modelBuilder.Entity<PlaylistMusica>()
            .HasOne(pm => pm.Musica)
            .WithMany(m => m.PlaylistMusicas)
            .HasForeignKey(pm => pm.MusicaId);
    }
    
}