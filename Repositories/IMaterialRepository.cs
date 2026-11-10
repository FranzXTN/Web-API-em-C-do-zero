public interface IMaterialRepository
{
    
IEnumerable<MaterialBiblioteca> ObterTodos();

MaterialBiblioteca? ObterPorId(int id);

bool Adicionar(MaterialBiblioteca material);

bool Atualizar(int id, MaterialBiblioteca material);

bool Remover(int id);
}