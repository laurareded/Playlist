using CriePlaylist.Models;
using Microsoft.EntityFrameworkCore;

namespace CriePlaylist.Data;

public class AppDbContext : DbContext
{

    public AppDbContext(DbContextOptions options) : base(options) { }

    public DbSet<Musica> Musicas { get; set; }
    
}