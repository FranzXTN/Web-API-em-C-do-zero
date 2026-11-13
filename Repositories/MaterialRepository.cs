public class MaterialRepository : IMaterialRepository
{
    private Dictionary<int, MaterialBiblioteca> _materiais = new Dictionary<int, MaterialBiblioteca>()
    {
        {1, new Livro {Id = 1, titulo = "Assim falou Zaratustra", anoPublicacao = 1883, autor = "Friedrich Nietzche", paginas = 400}},
        {2, new Revista {Id = 2, titulo = "Recreio", anoPublicacao = 2010, Edicao = 7, mesPublicacao = 11}},
    };

    private int _ultimoId = 2;

    private int GerarNovoId()
    {
        _ultimoId = Math.Max(_ultimoId, _materiais.Count == 0 ? 0 : _materiais.Keys.Max()) + 1;
        return _ultimoId;
    }

    public IEnumerable<MaterialBiblioteca> ObterTodos()
    {
        return _materiais.Values;
    }

    public MaterialBiblioteca? ObterPorId(int id)
    {
        if (!_materiais.ContainsKey(id))
        {
            return null;
        }
        return _materiais[id];
    }

    public MaterialBiblioteca Adicionar(MaterialBiblioteca material)
    {
        material.Id = GerarNovoId();
        _materiais.Add(material.Id, material);
        return material;
    }

    public bool Atualizar(int id, MaterialBiblioteca material)
    {
        if (!_materiais.ContainsKey(id))
        {
            return false;
        }

        material.Id = id; // o ID da URL prevalece
        _materiais[id] = material;
        return true;
    }

    public bool Remover(int id)
    {
        return _materiais.Remove(id);
    }
}