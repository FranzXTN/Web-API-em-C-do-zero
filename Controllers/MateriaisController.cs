using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]

public class MateriaisController : ControllerBase
{ 
    private IMaterialRepository _materiais;
    public MateriaisController (IMaterialRepository material)
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
        {   
            if (material == null)
            return NotFound("Aluno Não encontrado");
        }
        return Ok(material);
    }
}