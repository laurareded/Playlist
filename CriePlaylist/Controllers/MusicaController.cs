using CriePlaylist.Data;
using CriePlaylist.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CriePlaylist.Controllers;

[ApiController]
[Route("api/[controller]")]

public class MusicaController : ControllerBase
{

    private readonly AppDbContext _appDbContext;

    public MusicaController(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    [HttpPost]
    public async Task<IActionResult> AddMusica([FromBody] Musica musica)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _appDbContext.Musicas.Add(musica);
        await _appDbContext.SaveChangesAsync();

        return Created("Musica cadastrada com sucesso!", musica);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Musica>>> GetMusicas()
    {
        var musicas = await _appDbContext.Musicas.ToListAsync();
        return Ok(musicas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Musica>> GetMusica(int id)
    {
        var musica = await _appDbContext.Musicas.FindAsync(id);

        if (musica == null)
            return NotFound("Musica nao encontrada!");
        return Ok(musica);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMusica(int id, [FromBody] Musica musicaAtualizada)
    {
        var musicaExistente = await _appDbContext.Musicas.FindAsync(id);

        if (musicaExistente == null)
            return NotFound("Musica nao encontrada!");

        _appDbContext.Entry(musicaExistente).CurrentValues.SetValues(musicaAtualizada);
        await _appDbContext.SaveChangesAsync();

        return StatusCode(201, musicaAtualizada);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMusica(int id)
    {
        var musica = await _appDbContext.Musicas.FindAsync(id);

        if (musica == null)
            return NotFound("Musica nao encontrada!");

        _appDbContext.Musicas.Remove(musica);
        await _appDbContext.SaveChangesAsync();

        return Ok("Musica excluida com sucesso!");
    }


}

