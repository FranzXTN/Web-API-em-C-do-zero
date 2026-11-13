using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class MateriaisController : ControllerBase
{
    private IMaterialRepository _materiais;

    public MateriaisController(IMaterialRepository material)
    {
        _materiais = material;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_materiais.ObterTodos());
    }

    [HttpGet("{id}")]
    public IActionResult GetbyId(int id)
    {
        var material = _materiais.ObterPorId(id);
        if (material == null)
            return NotFound("Material não encontrado");

        return Ok(material);
    }

    [HttpPost("livro")]
    public IActionResult PostLivro([FromBody] Livro livro)
    {
        var erro = ValidarLivro(livro);
        if (erro != null)
            return BadRequest(erro);

        var criado = _materiais.Adicionar(livro);
        return CreatedAtAction(nameof(GetbyId), new { id = criado.Id }, criado);
    }

    [HttpPost("revista")]
    public IActionResult PostRevista([FromBody] Revista revista)
    {
        var erro = ValidarRevista(revista);
        if (erro != null)
            return BadRequest(erro);

        var criado = _materiais.Adicionar(revista);
        return CreatedAtAction(nameof(GetbyId), new { id = criado.Id }, criado);
    }

    [HttpPut("livro/{id}")]
    public IActionResult PutLivro(int id, [FromBody] Livro livro)
    {
        var existente = _materiais.ObterPorId(id);
        if (existente == null)
            return NotFound("Material não encontrado");

        if (existente is not Livro)
            return BadRequest("O material informado não é um livro.");

        var erro = ValidarLivro(livro);
        if (erro != null)
            return BadRequest(erro);

        _materiais.Atualizar(id, livro);
        return Ok(livro);
    }

    [HttpPut("revista/{id}")]
    public IActionResult PutRevista(int id, [FromBody] Revista revista)
    {
        var existente = _materiais.ObterPorId(id);
        if (existente == null)
            return NotFound("Material não encontrado");

        if (existente is not Revista)
            return BadRequest("O material informado não é uma revista.");

        var erro = ValidarRevista(revista);
        if (erro != null)
            return BadRequest(erro);

        _materiais.Atualizar(id, revista);
        return Ok(revista);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        if (!_materiais.Remover(id))
            return NotFound("Material não encontrado");

        return NoContent();
    }

    [HttpGet("{id}/descricao")]
    public IActionResult GetDescricao(int id)
    {
        var material = _materiais.ObterPorId(id);
        if (material == null)
            return NotFound("Material não encontrado");

        return Ok(new
        {
            id = material.Id,
            tipo = material.Tipo,
            descricao = material.Descricao(),
            prazoEmprestimo = material.CalcularPrazo()
        });
    }


    [HttpPost("{id}/emprestar")]
    public IActionResult Emprestar(int id)
    {
        var material = _materiais.ObterPorId(id);
        if (material == null)
            return NotFound("Material não encontrado");

        if (material is not IEmprestimo emprestavel)
            return BadRequest($"O material '{material.titulo}' ({material.Tipo}) não pode ser emprestado.");

        return Ok(emprestavel.Emprestar());
    }


    private static string? ValidarMaterial(MaterialBiblioteca material)
    {
        if (string.IsNullOrWhiteSpace(material.titulo))
            return "O título é obrigatório.";

        if (material.anoPublicacao < 0)
            return "O ano de publicação não pode ser menor que 0.";

        return null;
    }

    private static string? ValidarLivro(Livro livro)
    {
        var erro = ValidarMaterial(livro);
        if (erro != null)
            return erro;

        if (string.IsNullOrWhiteSpace(livro.autor))
            return "O autor é obrigatório.";

        if (livro.paginas <= 0)
            return "O número de páginas deve ser maior que 0.";

        return null;
    }

    private static string? ValidarRevista(Revista revista)
    {
        var erro = ValidarMaterial(revista);
        if (erro != null)
            return erro;

        if (revista.Edicao <= 0)
            return "A edição deve ser maior que 0.";

        if (revista.mesPublicacao < 1 || revista.mesPublicacao > 12)
            return "O mês de publicação deve estar entre 1 e 12.";

        return null;
    }
}