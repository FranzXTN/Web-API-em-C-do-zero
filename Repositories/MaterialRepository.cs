public class MaterialRepository : IMaterialRepository
{
    private Dictionary<int, MaterialBiblioteca> _materiais = new Dictionary<int, MaterialBiblioteca>()
    {
        {1, new Livro {Id = 1, titulo = "Assim falou Zaratustra", anoPublicacao = 1883, autor = "Friedrich Nietzche", paginas = 400}},
        {2, new Revista {Id = 2, titulo = "Recreio", anoPublicacao = 2010, Edicao = "Número 7", mesPublicacao = "Novembro"}},
    };

    private int GerarNovoId()
{
    if (_materiais.Count == 0)
        return 1;

    return _materiais.Keys.Max() + 1;
}

    public IEnumerable<MaterialBiblioteca> ObterTodos()
    {
        return _materiais.Values;
    }

      public MaterialBiblioteca? ObterPorId (int id)
    {
        if (!_materiais.ContainsKey(id))
        {
            return null;
        }
        return _materiais[id];
    }

    public bool Adicionar(MaterialBiblioteca material)
    {
        int novoId = GerarNovoId();

        _materiais.Add(novoId, material );

        return true;
    }

        public bool Atualizar (int id, MaterialBiblioteca material)
   {
        if (!_materiais.ContainsKey(id))
        {
            return false;
        }
        
        _materiais.Add(id, material);
        return true;
    }

        public bool Remover(int id)
   {
        if (!_materiais.ContainsKey(id))
        {
            return false;
        }
        _materiais.Remove(id);
        return true;
    }

}