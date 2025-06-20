using Microsoft.AspNetCore.Mvc;
using CriePlaylist.Models;
using CriePlaylist.Data;
using Microsoft.EntityFrameworkCore;

namespace CriePlaylist.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlaylistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlaylistController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Playlist
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Playlist>>> GetPlaylists()
        {
            return await _context.Playlists
                .Include(p => p.PlaylistMusicas)
                .ThenInclude(pm => pm.Musica)
                .ToListAsync();
        }

        // GET: api/Playlist/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Playlist>> GetPlaylist(int id)
        {
            var playlist = await _context.Playlists
                .Include(p => p.PlaylistMusicas)
                .ThenInclude(pm => pm.Musica)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (playlist == null)
            {
                return NotFound();
            }

            return playlist;
        }

        // POST: api/Playlist
        [HttpPost]
        public async Task<ActionResult<Playlist>> PostPlaylist(Playlist playlist)
        {
            _context.Playlists.Add(playlist);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPlaylist", new { id = playlist.Id }, playlist);
        }

        // PUT: api/Playlist/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlaylist(int id, Playlist playlist)
        {
            if (id != playlist.Id)
            {
                return BadRequest();
            }

            _context.Entry(playlist).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlaylistExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Playlist/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlaylist(int id)
        {
            var playlist = await _context.Playlists.FindAsync(id);
            if (playlist == null)
            {
                return NotFound();
            }

            _context.Playlists.Remove(playlist);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Playlist/{playlistId}/AdicionarMusica/{musicaId}
        [HttpPost("{playlistId}/AdicionarMusica/{musicaId}")]
        public async Task<IActionResult> AdicionarMusica(int playlistId, int musicaId)
        {
            var playlist = await _context.Playlists.FindAsync(playlistId);
            var musica = await _context.Musicas.FindAsync(musicaId);

            if (playlist == null || musica == null)
            {
                return NotFound();
            }

            // Evita duplicidade
            var jaExiste = await _context.PlaylistMusicas
                .AnyAsync(pm => pm.PlaylistId == playlistId && pm.MusicaId == musicaId);

            if (!jaExiste)
            {
                _context.PlaylistMusicas.Add(new PlaylistMusica
                {
                    PlaylistId = playlistId,
                    MusicaId = musicaId
                });
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        // DELETE: api/Playlist/{playlistId}/RemoverMusica/{musicaId}
        [HttpDelete("{playlistId}/RemoverMusica/{musicaId}")]
        public async Task<IActionResult> RemoverMusica(int playlistId, int musicaId)
        {
            var pm = await _context.PlaylistMusicas
                .FirstOrDefaultAsync(x => x.PlaylistId == playlistId && x.MusicaId == musicaId);

            if (pm == null)
            {
                return NotFound();
            }

            _context.PlaylistMusicas.Remove(pm);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PlaylistExists(int id)
        {
            return _context.Playlists.Any(e => e.Id == id);
        }
    }
}
