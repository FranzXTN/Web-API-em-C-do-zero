using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]

public class MateriaisController : ControllerBase
{ 
    private IMaterialRepository _materiais;
    public MateriaisController (MaterialRepository material)
    {
        _materiais = material;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_materiais.Values());
    }

}